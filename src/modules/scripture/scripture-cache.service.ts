import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class ScriptureCacheService {
  private redis: Redis | null = null;
  private readonly TTL = 86400; // 24 hours in seconds
  private enabled: boolean;

  constructor(private configService: ConfigService) {
    this.enabled = this.configService.get('REDIS_HOST') ? true : false;
    
    if (this.enabled) {
      try {
        this.redis = new Redis({
          host: this.configService.get('REDIS_HOST') || 'localhost',
          port: this.configService.get('REDIS_PORT') || 6379,
          retryStrategy: (times) => {
            if (times > 3) {
              console.warn('[Cache] Redis connection failed, disabling cache');
              this.enabled = false;
              return null;
            }
            return Math.min(times * 100, 3000);
          },
        });
        
        this.redis.on('error', (err) => {
          console.error('[Cache] Redis error:', err.message);
        });
        
        this.redis.on('connect', () => {
          console.log('[Cache] Redis connected successfully');
        });
      } catch (error) {
        console.warn('[Cache] Failed to initialize Redis:', error.message);
        this.enabled = false;
      }
    } else {
      console.log('[Cache] Redis not configured, caching disabled');
    }
  }

  /**
   * Generate cache key for API.Bible passage
   */
  private getPassageKey(bibleId: string, passageId: string): string {
    return `bible:passage:${bibleId}:${passageId}`;
  }

  /**
   * Generate cache key for API.Bible search
   */
  private getSearchKey(bibleId: string, query: string): string {
    return `bible:search:${bibleId}:${query}`;
  }

  /**
   * Generate cache key for audio Bible
   */
  private getAudioKey(audioBibleId: string, chapterId: string): string {
    return `bible:audio:${audioBibleId}:${chapterId}`;
  }

  private getWordStudyKey(word: string, language: string, responseLanguage: string): string {
    return `scripture:word-study:${String(language || 'greek').toLowerCase()}:${String(responseLanguage || 'en').toLowerCase()}:${encodeURIComponent(String(word || '').trim().toLowerCase())}`;
  }

  private getWordStudyInsightsKey(
    word: string,
    language: string,
    context: string,
    responseLanguage: string,
  ): string {
    return `scripture:word-study-insights:${String(language || 'greek').toLowerCase()}:${String(responseLanguage || 'en').toLowerCase()}:${encodeURIComponent(String(word || '').trim().toLowerCase())}:${encodeURIComponent(String(context || '').trim().toLowerCase())}`;
  }

  private getWordStudySuggestionsKey(
    reference: string,
    translationCode: string,
    language: string,
    responseLanguage: string,
  ): string {
    return `scripture:word-study-suggestions:${String(translationCode || 'KJV').toUpperCase()}:${String(language || 'greek').toLowerCase()}:${String(responseLanguage || 'en').toLowerCase()}:${encodeURIComponent(String(reference || '').trim().toLowerCase())}`;
  }

  /**
   * Get cached passage
   */
  async getPassage(bibleId: string, passageId: string): Promise<any | null> {
    if (!this.enabled || !this.redis) return null;

    try {
      const key = this.getPassageKey(bibleId, passageId);
      const cached = await this.redis.get(key);
      
      if (cached) {
        const parsed = JSON.parse(cached);
        const hasVerses = Array.isArray(parsed?.verses) && parsed.verses.length > 0;

        if (!hasVerses) {
          // Remove poisoned cache entries so future lookups force a fresh API fetch.
          await this.redis.del(key);
          console.warn(`[Cache] EVICT EMPTY PASSAGE: ${key}`);
          return null;
        }

        console.log(`[Cache] HIT: ${key}`);
        return parsed;
      }
      
      console.log(`[Cache] MISS: ${key}`);
      return null;
    } catch (error) {
      console.error('[Cache] Get error:', error.message);
      return null;
    }
  }

  /**
   * Cache passage response
   */
  async setPassage(bibleId: string, passageId: string, data: any): Promise<void> {
    if (!this.enabled || !this.redis) return;

    try {
      const key = this.getPassageKey(bibleId, passageId);
      await this.redis.setex(key, this.TTL, JSON.stringify(data));
      console.log(`[Cache] SET: ${key}`);
    } catch (error) {
      console.error('[Cache] Set error:', error.message);
    }
  }

  /**
   * Get cached search results
   */
  async getSearch(bibleId: string, query: string): Promise<any | null> {
    if (!this.enabled || !this.redis) return null;

    try {
      const key = this.getSearchKey(bibleId, query);
      const cached = await this.redis.get(key);
      
      if (cached) {
        console.log(`[Cache] HIT: ${key}`);
        return JSON.parse(cached);
      }
      
      console.log(`[Cache] MISS: ${key}`);
      return null;
    } catch (error) {
      console.error('[Cache] Get error:', error.message);
      return null;
    }
  }

  /**
   * Cache search results
   */
  async setSearch(bibleId: string, query: string, data: any): Promise<void> {
    if (!this.enabled || !this.redis) return;

    try {
      const key = this.getSearchKey(bibleId, query);
      // Search results cached for 1 hour
      await this.redis.setex(key, 3600, JSON.stringify(data));
      console.log(`[Cache] SET: ${key}`);
    } catch (error) {
      console.error('[Cache] Set error:', error.message);
    }
  }

  /**
   * Get cached audio Bible chapter
   */
  async getAudio(audioBibleId: string, chapterId: string): Promise<any | null> {
    if (!this.enabled || !this.redis) return null;

    try {
      const key = this.getAudioKey(audioBibleId, chapterId);
      const cached = await this.redis.get(key);
      
      if (cached) {
        console.log(`[Cache] HIT: ${key}`);
        return JSON.parse(cached);
      }
      
      console.log(`[Cache] MISS: ${key}`);
      return null;
    } catch (error) {
      console.error('[Cache] Get error:', error.message);
      return null;
    }
  }

  /**
   * Cache audio Bible chapter
   */
  async setAudio(audioBibleId: string, chapterId: string, data: any): Promise<void> {
    if (!this.enabled || !this.redis) return;

    try {
      const key = this.getAudioKey(audioBibleId, chapterId);
      // Audio URLs cached for 7 days
      await this.redis.setex(key, 604800, JSON.stringify(data));
      console.log(`[Cache] SET: ${key}`);
    } catch (error) {
      console.error('[Cache] Set error:', error.message);
    }
  }

  async getWordStudy(word: string, language: string, responseLanguage: string): Promise<any | null> {
    if (!this.enabled || !this.redis) return null;

    try {
      const key = this.getWordStudyKey(word, language, responseLanguage);
      const cached = await this.redis.get(key);
      if (!cached) return null;
      console.log(`[Cache] HIT: ${key}`);
      return JSON.parse(cached);
    } catch (error) {
      console.error('[Cache] WordStudy get error:', error.message);
      return null;
    }
  }

  async setWordStudy(word: string, language: string, responseLanguage: string, data: any): Promise<void> {
    if (!this.enabled || !this.redis) return;

    try {
      const key = this.getWordStudyKey(word, language, responseLanguage);
      // Cache lexicon lookups for 7 days.
      await this.redis.setex(key, 604800, JSON.stringify(data));
      console.log(`[Cache] SET: ${key}`);
    } catch (error) {
      console.error('[Cache] WordStudy set error:', error.message);
    }
  }

  async getWordStudyInsights(
    word: string,
    language: string,
    context: string,
    responseLanguage: string,
  ): Promise<any | null> {
    if (!this.enabled || !this.redis) return null;

    try {
      const key = this.getWordStudyInsightsKey(word, language, context, responseLanguage);
      const cached = await this.redis.get(key);
      if (!cached) return null;
      console.log(`[Cache] HIT: ${key}`);
      return JSON.parse(cached);
    } catch (error) {
      console.error('[Cache] WordStudyInsights get error:', error.message);
      return null;
    }
  }

  async setWordStudyInsights(
    word: string,
    language: string,
    context: string,
    responseLanguage: string,
    data: any,
  ): Promise<void> {
    if (!this.enabled || !this.redis) return;

    try {
      const key = this.getWordStudyInsightsKey(word, language, context, responseLanguage);
      // Cache LLM insights for 3 days.
      await this.redis.setex(key, 259200, JSON.stringify(data));
      console.log(`[Cache] SET: ${key}`);
    } catch (error) {
      console.error('[Cache] WordStudyInsights set error:', error.message);
    }
  }

  async getWordStudySuggestions(
    reference: string,
    translationCode: string,
    language: string,
    responseLanguage: string,
  ): Promise<any[] | null> {
    if (!this.enabled || !this.redis) return null;

    try {
      const key = this.getWordStudySuggestionsKey(reference, translationCode, language, responseLanguage);
      const cached = await this.redis.get(key);
      if (!cached) return null;
      console.log(`[Cache] HIT: ${key}`);
      const parsed = JSON.parse(cached);
      return Array.isArray(parsed) ? parsed : null;
    } catch (error) {
      console.error('[Cache] WordStudySuggestions get error:', error.message);
      return null;
    }
  }

  async setWordStudySuggestions(
    reference: string,
    translationCode: string,
    language: string,
    responseLanguage: string,
    data: any[],
  ): Promise<void> {
    if (!this.enabled || !this.redis) return;

    try {
      const key = this.getWordStudySuggestionsKey(reference, translationCode, language, responseLanguage);
      // Cache suggestion extraction for 12 hours.
      await this.redis.setex(key, 43200, JSON.stringify(Array.isArray(data) ? data : []));
      console.log(`[Cache] SET: ${key}`);
    } catch (error) {
      console.error('[Cache] WordStudySuggestions set error:', error.message);
    }
  }

  /**
   * Invalidate all cache for a specific Bible
   */
  async invalidateBible(bibleId: string): Promise<void> {
    if (!this.enabled || !this.redis) return;

    try {
      const pattern = `bible:*:${bibleId}:*`;
      const keys = await this.redis.keys(pattern);
      
      if (keys.length > 0) {
        await this.redis.del(...keys);
        console.log(`[Cache] Invalidated ${keys.length} keys for ${bibleId}`);
      }
    } catch (error) {
      console.error('[Cache] Invalidate error:', error.message);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{ enabled: boolean; keys?: number; memory?: string }> {
    if (!this.enabled || !this.redis) {
      return { enabled: false };
    }

    try {
      const info = await this.redis.info('stats');
      const keyspace = await this.redis.info('keyspace');
      
      // Parse keyspace info to get key count
      const dbMatch = keyspace.match(/db0:keys=(\d+)/);
      const keys = dbMatch ? parseInt(dbMatch[1]) : 0;
      
      // Parse memory info
      const memoryMatch = info.match(/used_memory_human:(.+)/);
      const memory = memoryMatch ? memoryMatch[1].trim() : 'unknown';
      
      return { enabled: true, keys, memory };
    } catch (error) {
      console.error('[Cache] Stats error:', error.message);
      return { enabled: true };
    }
  }

  /**
   * Clear all cache
   */
  async clearAll(): Promise<void> {
    if (!this.enabled || !this.redis) return;

    try {
      await this.redis.flushdb();
      console.log('[Cache] All cache cleared');
    } catch (error) {
      console.error('[Cache] Clear error:', error.message);
    }
  }

  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.quit();
    }
  }
}
