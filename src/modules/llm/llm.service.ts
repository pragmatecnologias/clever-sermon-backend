import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { LlmRequest } from '../../entities/llm-request.entity';
import { LlmProvider } from '../../entities/enums/llm-provider.enum';
import { LlmPrompts } from './llm-prompts';

@Injectable()
export class LlmService {
  private static readonly LOCAL_TIMEOUT_MS = 45000;
  private static readonly LOCAL_MAX_ATTEMPTS = 3;
  private readonly providerHealthCache = new Map<
    LlmProvider,
    { status: 'ready' | 'needs_service' | 'failed'; message: string; checkedAt: string }
  >();

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

  private inferProviderFailure(error: any): string | null {
    const status = error?.response?.status;
    const code = error?.response?.data?.base_resp?.status_code ?? error?.response?.data?.error?.code ?? error?.code;
    const message = String(error?.message || error?.response?.data?.base_resp?.status_msg || '').toLowerCase();
    if (
      status === 401 ||
      status === 403 ||
      code === 2049 ||
      message.includes('invalid api key') ||
      message.includes('unauthorized') ||
      message.includes('authentication') ||
      message.includes('api key is not configured')
    ) {
      return String(error?.message || 'Provider authentication failed');
    }
    return null;
  }

  private setProviderHealth(
    provider: LlmProvider,
    status: 'ready' | 'needs_service' | 'failed',
    message: string,
  ) {
    this.providerHealthCache.set(provider, {
      status,
      message,
      checkedAt: new Date().toISOString(),
    });
  }

  getProviderHealth(provider: LlmProvider): { status: 'ready' | 'needs_service' | 'failed'; message: string; checkedAt?: string } {
    const cached = this.providerHealthCache.get(provider);
    if (cached) {
      return cached;
    }

    if (provider === LlmProvider.LOCAL) {
      const configured = Boolean(this.configService.get('LM_STUDIO_URL'));
      return configured
        ? { status: 'ready', message: 'Local LLM is configured for generation.' }
        : { status: 'needs_service', message: 'Configure LM_STUDIO_URL to enable local generation.' };
    }

    if (provider === LlmProvider.OPENAI) {
      const configured = Boolean(this.configService.get('OPENAI_API_KEY'));
      return configured
        ? { status: 'ready', message: 'OpenAI is configured for generation.' }
        : { status: 'needs_service', message: 'Configure OPENAI_API_KEY to enable generation.' };
    }

    const configured = Boolean(this.configService.get('MINIMAX_API_KEY'));
    return configured
      ? { status: 'ready', message: 'MiniMax is configured for generation.' }
      : { status: 'needs_service', message: 'Configure MINIMAX_API_KEY to enable generation.' };
  }

  getConfiguredProvider(): LlmProvider | null {
    if (this.configService.get('LM_STUDIO_URL')) return LlmProvider.LOCAL;
    if (this.configService.get('OPENAI_API_KEY')) return LlmProvider.OPENAI;
    if (this.configService.get('MINIMAX_API_KEY')) return LlmProvider.MINIMAX;
    return null;
  }

  getConfiguredProviderLabel(): string {
    const provider = this.getConfiguredProvider();
    if (provider === LlmProvider.LOCAL) return 'Local LLM';
    if (provider === LlmProvider.OPENAI) return 'OpenAI';
    if (provider === LlmProvider.MINIMAX) return 'MiniMax';
    return 'No LLM provider';
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
      localMaxAttempts?: number;
    } = {},
  ): Promise<string> {
    const provider = options.provider || LlmProvider.MINIMAX;
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
      } else if (provider === LlmProvider.MINIMAX) {
        const result = await this.callMiniMax(prompt, options);
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

      this.setProviderHealth(provider, 'ready', `${provider} responded successfully.`);

      return response;
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      const providerFailure = this.inferProviderFailure(error);

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

      if (providerFailure) {
        this.setProviderHealth(provider, 'failed', providerFailure);
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

    const maxAttempts = Math.max(1, Math.min(3, Number(options?.localMaxAttempts || LlmService.LOCAL_MAX_ATTEMPTS)));

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const maxTokens =
        attempt === 1
          ? baseMaxTokens
          : attempt === 2
            ? Math.max(350, Math.floor(baseMaxTokens * 0.65))
            : Math.max(280, Math.floor(baseMaxTokens * 0.5));
      const promptLimit =
        attempt === 1 ? prompt.length : attempt === 2 ? Math.floor(prompt.length * 0.85) : Math.floor(prompt.length * 0.7);
      const attemptPrompt = promptLimit < prompt.length ? `${prompt.slice(0, promptLimit)}\n\n[Prompt truncated for transport safety]` : prompt;

      try {
        const response = await axios.post(
          `${lmStudioUrl}/chat/completions`,
          {
            model,
            messages: [{ role: 'user', content: attemptPrompt }],
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
        if (!this.shouldRetryLocalLlm(error) || attempt === maxAttempts) {
          break;
        }
      }
    }

    throw this.wrapLocalLlmError(lastError, model);
  }

  private shouldRetryLocalLlm(error: any): boolean {
    const status = error?.response?.status;
    const code = error?.code;
    const bodyText =
      typeof error?.response?.data === 'string'
        ? error.response.data.toLowerCase()
        : JSON.stringify(error?.response?.data || '').toLowerCase();
    const retryable400 =
      status === 400 &&
      (
        bodyText.includes('context') ||
        bodyText.includes('max token') ||
        bodyText.includes('too long') ||
        bodyText.includes('invalid request')
      );
    return (
      status >= 500 ||
      retryable400 ||
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

  private async callMiniMax(
    prompt: string,
    options: any,
  ): Promise<{ response: string; model: string }> {
    const apiKey = this.configService.get('MINIMAX_API_KEY');
    if (!apiKey) {
      throw new Error('MINIMAX_API_KEY is not configured. Set it in your .env file.');
    }
    const model = options.model || 'MiniMax-M2.7';

    const response = await axios.post(
      'https://api.minimax.io/v1/text/chatcompletion_v2',
      {
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_completion_tokens: options.maxTokens || 2000,
      },
      {
        timeout: options.timeoutMs || 120000,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.data?.base_resp?.status_code !== 0) {
      throw new Error(
        `MiniMax API error: ${response.data.base_resp.status_msg} (code ${response.data.base_resp.status_code})`,
      );
    }

    const rawContent = response.data.choices[0].message.content || '';
    return {
      response: rawContent.replace(/^```json\s*/i, '').replace(/\s*```$/, ''),
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
    const prompt = LlmPrompts.sermonOutline({
      passage,
      theme,
      style,
      languageLabel,
    });

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
    const prompt = LlmPrompts.manuscript({
      outlineJson: JSON.stringify(outline, null, 2),
      passage,
      languageLabel,
    });

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
    const prompt = LlmPrompts.applications({
      audienceType,
      passage,
      mainPoints: mainPoints.join(', '),
      languageLabel,
    });

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
    const prompt = LlmPrompts.discussionQuestions({
      passage,
      theme,
      languageLabel,
    });

    const response = await this.generateCompletion(prompt, userId);
    
    return response.split('\n').filter(line => line.trim().length > 0);
  }
}
