import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ScriptureCacheService } from './scripture-cache.service';

@Injectable()
export class AudioBibleService {
  constructor(
    private configService: ConfigService,
    private cacheService: ScriptureCacheService,
  ) {}

  /**
   * Get available audio Bibles
   */
  async getAudioBibles(language?: string): Promise<any[]> {
    const apiKey = this.configService.get('BIBLE_API_KEY');
    const apiUrl = this.configService.get('BIBLE_API_URL');

    if (!apiKey || !apiUrl) {
      return [];
    }

    try {
      const params: any = {};
      if (language) {
        params.language = language;
      }

      const response = await axios.get(`${apiUrl}/audio-bibles`, {
        params,
        headers: { 'api-key': apiKey },
      });

      return response.data?.data || [];
    } catch (error) {
      console.error('[AudioBible] Failed to fetch audio Bibles:', error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Get audio Bible details
   */
  async getAudioBible(audioBibleId: string): Promise<any | null> {
    const apiKey = this.configService.get('BIBLE_API_KEY');
    const apiUrl = this.configService.get('BIBLE_API_URL');

    if (!apiKey || !apiUrl) {
      return null;
    }

    try {
      const response = await axios.get(`${apiUrl}/audio-bibles/${audioBibleId}`, {
        headers: { 'api-key': apiKey },
      });

      return response.data?.data || null;
    } catch (error) {
      console.error('[AudioBible] Failed to fetch audio Bible:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Get audio chapter
   */
  async getAudioChapter(audioBibleId: string, chapterId: string): Promise<any | null> {
    const apiKey = this.configService.get('BIBLE_API_KEY');
    const apiUrl = this.configService.get('BIBLE_API_URL');

    if (!apiKey || !apiUrl) {
      return null;
    }

    // Check cache first
    const cached = await this.cacheService.getAudio(audioBibleId, chapterId);
    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get(
        `${apiUrl}/audio-bibles/${audioBibleId}/chapters/${chapterId}`,
        {
          headers: { 'api-key': apiKey },
        },
      );

      const data = response.data?.data || null;

      // Cache the audio URL
      if (data) {
        await this.cacheService.setAudio(audioBibleId, chapterId, data);
      }

      return data;
    } catch (error) {
      console.error('[AudioBible] Failed to fetch audio chapter:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Get audio chapters for a book
   */
  async getAudioChapters(audioBibleId: string, bookId: string): Promise<any[]> {
    const apiKey = this.configService.get('BIBLE_API_KEY');
    const apiUrl = this.configService.get('BIBLE_API_URL');

    if (!apiKey || !apiUrl) {
      return [];
    }

    try {
      const response = await axios.get(
        `${apiUrl}/audio-bibles/${audioBibleId}/books/${bookId}/chapters`,
        {
          headers: { 'api-key': apiKey },
        },
      );

      return response.data?.data || [];
    } catch (error) {
      console.error('[AudioBible] Failed to fetch audio chapters:', error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Convert scripture reference to audio chapter ID
   * Example: "John 3:16" -> { audioBibleId, bookId: "JHN", chapterId: "JHN.3" }
   */
  parseReferenceForAudio(reference: string): { bookId: string; chapterId: string } | null {
    const match = reference.match(/^(.*?)\s+(\d+)(?::(\d+))?/);
    if (!match) {
      return null;
    }

    const bookName = match[1].toLowerCase().replace(/\s+/g, '');
    const chapter = match[2];

    // Simple book name to ID mapping (extend as needed)
    const bookMap: Record<string, string> = {
      'john': 'JHN',
      'matthew': 'MAT',
      'mark': 'MRK',
      'luke': 'LUK',
      'genesis': 'GEN',
      'exodus': 'EXO',
      'psalms': 'PSA',
      'psalm': 'PSA',
      // Add more as needed
    };

    const bookId = bookMap[bookName];
    if (!bookId) {
      return null;
    }

    return {
      bookId,
      chapterId: `${bookId}.${chapter}`,
    };
  }
}
