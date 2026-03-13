import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { LlmRequest } from '../../entities/llm-request.entity';
import { LlmProvider } from '../../entities/enums/llm-provider.enum';

@Injectable()
export class LlmService {
  private static readonly LOCAL_TIMEOUT_MS = 45000;
  private static readonly LOCAL_MAX_ATTEMPTS = 2;

  constructor(
    private configService: ConfigService,
    @InjectRepository(LlmRequest)
    private llmRequestRepository: Repository<LlmRequest>,
  ) {}

  private logLlmPayload(
    stage: 'request' | 'response' | 'error',
    data: {
      provider: LlmProvider;
      model: string;
      prompt: string;
      response?: string | null;
      latencyMs?: number;
      error?: string;
    },
  ) {
    const truncate = (value?: string | null, limit: number = 2000) => {
      if (!value) return value;
      return value.length > limit ? `${value.slice(0, limit)}...<truncated>` : value;
    };

    const payload = {
      provider: data.provider,
      model: data.model,
      latencyMs: data.latencyMs,
      prompt: truncate(data.prompt, 2000),
      response: truncate(data.response ?? undefined, 4000),
      error: data.error,
    };

    if (stage === 'request') {
      console.log('[LLM][request]', payload);
    } else if (stage === 'response') {
      console.log('[LLM][response]', payload);
    } else {
      console.warn('[LLM][error]', payload);
    }
  }

  async generateCompletion(
    prompt: string,
    userId: string,
    options: {
      provider?: LlmProvider;
      model?: string;
      temperature?: number;
      maxTokens?: number;
      timeoutMs?: number;
    } = {},
  ): Promise<string> {
    const provider = options.provider || LlmProvider.LOCAL;
    const startTime = Date.now();
    const shouldLog = this.configService.get('LOG_LLM_REQUESTS') === 'true';

    try {
      let response: string;
      let model: string;

      if (shouldLog) {
        this.logLlmPayload('request', {
          provider,
          model: options.model || 'unknown',
          prompt,
        });
      }

      if (provider === LlmProvider.LOCAL) {
        const result = await this.callLocalLLM(prompt, options);
        response = result.response;
        model = result.model;
      } else if (provider === LlmProvider.OPENAI) {
        const result = await this.callOpenAI(prompt, options);
        response = result.response;
        model = result.model;
      } else {
        throw new Error(`Unsupported provider: ${provider}`);
      }

      const latencyMs = Date.now() - startTime;

      if (shouldLog) {
        this.logLlmPayload('response', {
          provider,
          model,
          prompt,
          response,
          latencyMs,
        });
        await this.llmRequestRepository.save({
          userId,
          provider,
          model,
          prompt,
          response,
          tokenCount: this.estimateTokens(prompt + response),
          latencyMs,
          wasSuccessful: true,
        });
      }

      return response;
    } catch (error) {
      const latencyMs = Date.now() - startTime;

      if (shouldLog) {
        this.logLlmPayload('error', {
          provider,
          model: options.model || 'unknown',
          prompt,
          latencyMs,
          error: error.message,
        });
        await this.llmRequestRepository.save({
          userId,
          provider,
          model: options.model || 'unknown',
          prompt,
          response: null,
          tokenCount: null,
          latencyMs,
          wasSuccessful: false,
          error: error.message,
        });
      }

      throw error;
    }
  }

  private async callLocalLLM(
    prompt: string,
    options: any,
  ): Promise<{ response: string; model: string }> {
    const lmStudioUrl = this.configService.get('LM_STUDIO_URL');
    const model = options.model || this.configService.get('LLM_MODEL_NAME') || 'local-model';
    const baseMaxTokens = options.maxTokens || 2000;
    // Use custom timeout if provided, otherwise scale timeout based on token count
    const timeoutMs = options.timeoutMs || Math.max(LlmService.LOCAL_TIMEOUT_MS, baseMaxTokens * 30);
    let lastError: any;

    for (let attempt = 1; attempt <= LlmService.LOCAL_MAX_ATTEMPTS; attempt++) {
      const maxTokens =
        attempt === 1 ? baseMaxTokens : Math.max(400, Math.floor(baseMaxTokens * 0.7));

      try {
        const response = await axios.post(
          `${lmStudioUrl}/chat/completions`,
          {
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: options.temperature || 0.7,
            max_tokens: maxTokens,
            frequency_penalty: 1.2,
            presence_penalty: 0.6,
            repeat_penalty: 1.3,
          },
          {
            timeout: timeoutMs,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const content = response.data?.choices?.[0]?.message?.content;
        if (typeof content !== 'string' || !content.trim()) {
          throw new Error('Local LLM returned an empty completion payload');
        }

        return {
          response: content,
          model,
        };
      } catch (error: any) {
        lastError = error;
        if (!this.shouldRetryLocalLlm(error) || attempt === LlmService.LOCAL_MAX_ATTEMPTS) {
          break;
        }
      }
    }

    throw this.wrapLocalLlmError(lastError, model);
  }

  private shouldRetryLocalLlm(error: any): boolean {
    const status = error?.response?.status;
    const code = error?.code;
    return (
      status >= 500 ||
      code === 'ECONNABORTED' ||
      code === 'ETIMEDOUT' ||
      code === 'ECONNRESET'
    );
  }

  private wrapLocalLlmError(error: any, model: string): Error {
    const status = error?.response?.status;
    const code = error?.code;
    const body =
      typeof error?.response?.data === 'string'
        ? error.response.data.replace(/\s+/g, ' ').trim().slice(0, 180)
        : '';
    const parts = [`Local LLM request failed for model ${model}`];
    if (status) parts.push(`status ${status}`);
    if (code) parts.push(`code ${code}`);
    if (body) parts.push(body);
    return new Error(parts.join(' - '));
  }

  private async callOpenAI(
    prompt: string,
    options: any,
  ): Promise<{ response: string; model: string }> {
    const apiKey = this.configService.get('OPENAI_API_KEY');
    const model = options.model || 'gpt-4';

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return {
      response: response.data.choices[0].message.content,
      model,
    };
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  async generateSermonOutline(
    passage: string,
    theme: string,
    style: string,
    language: string,
    userId: string,
  ): Promise<any> {
    const languageLabel = language === 'es' ? 'Spanish' : 'English';
    const prompt = `Generate a sermon outline for the following:
Passage: ${passage}
Theme: ${theme}
Style: ${style}

Write in ${languageLabel}.

Please provide a structured outline with:
1. Introduction
2. Main Points (3-5 points)
3. Conclusion
4. Call to Action

Format the response as JSON.`;

    const response = await this.generateCompletion(prompt, userId);
    
    try {
      return JSON.parse(response);
    } catch {
      return { rawResponse: response };
    }
  }

  async generateManuscript(
    outline: any,
    passage: string,
    language: string,
    userId: string,
  ): Promise<string> {
    const languageLabel = language === 'es' ? 'Spanish' : 'English';
    const prompt = `Generate a full sermon manuscript based on this outline:
${JSON.stringify(outline, null, 2)}

Passage: ${passage}

Write in ${languageLabel}.

Please write a complete sermon manuscript with smooth transitions between points.`;

    return this.generateCompletion(prompt, userId);
  }

  async generateApplications(
    passage: string,
    mainPoints: string[],
    audienceType: string,
    language: string,
    userId: string,
  ): Promise<string[]> {
    const languageLabel = language === 'es' ? 'Spanish' : 'English';
    const prompt = `Generate practical applications for ${audienceType} based on:
Passage: ${passage}
Main Points: ${mainPoints.join(', ')}

Write in ${languageLabel}.

Provide 3-5 specific, actionable applications.`;

    const response = await this.generateCompletion(prompt, userId);
    
    return response.split('\n').filter(line => line.trim().length > 0);
  }

  async generateDiscussionQuestions(
    passage: string,
    theme: string,
    language: string,
    userId: string,
  ): Promise<string[]> {
    const languageLabel = language === 'es' ? 'Spanish' : 'English';
    const prompt = `Generate discussion questions for a small group study on:
Passage: ${passage}
Theme: ${theme}

Write in ${languageLabel}.

Provide 5-7 thought-provoking questions that encourage deep reflection and application.`;

    const response = await this.generateCompletion(prompt, userId);
    
    return response.split('\n').filter(line => line.trim().length > 0);
  }
}
