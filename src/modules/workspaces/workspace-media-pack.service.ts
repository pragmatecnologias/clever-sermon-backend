import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { WorkspacesService } from './workspaces.service';
import { ComposeMediaPackDto } from './dto/compose-media-pack.dto';

type SlideExportArtifact = {
  type: 'pptx' | 'pdf';
  label: string;
  status: string;
  fileUrl?: string | null;
};

type MediaPackManifest = {
  status: 'draft' | 'ready' | 'outdated';
  generatedAt: string;
  sourceOutlineId: string | null;
  sourceManuscriptId: string | null;
  sourceStudyReportId: string | null;
  deckIntent?: string;
  deckModeLabel?: string;
  activeSermonDeckId?: string | null;
  activeSocialDeckId?: string | null;
  latestDeckByIntent?: Record<string, string | null>;
  archivedDeckIds?: string[];
  slideCount?: number;
  deckId?: string | null;
  sermonId?: string | null;
  exportPrepared: boolean;
  warnings?: string[];
  artifacts: SlideExportArtifact[];
};

@Injectable()
export class WorkspaceMediaPackService {
  private readonly slidesClient: AxiosInstance;
  private cachedSlidesServiceToken: string | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly workspacesService: WorkspacesService,
    @InjectRepository(SermonWorkspace)
    private readonly workspaceRepository: Repository<SermonWorkspace>,
  ) {
    this.slidesClient = axios.create({
      baseURL: this.getSlidesApiBaseUrl(),
      timeout: 120000,
    });
  }

  private getSlidesApiBaseUrl() {
    return this.configService.get<string>('SLIDES_API_URL') || 'http://localhost:3001/api/v1';
  }

  private extractToken(authorization?: string) {
    const raw = String(authorization || '').trim();
    if (!raw) return null;
    return raw.toLowerCase().startsWith('bearer ') ? raw.slice(7).trim() : raw;
  }

  private async getSlidesServiceToken() {
    if (this.cachedSlidesServiceToken) {
      return this.cachedSlidesServiceToken;
    }

    const email = this.configService.get<string>('SLIDES_SERVICE_EMAIL') || 'media-proxy@clever-sermon.local';
    const password = this.configService.get<string>('SLIDES_SERVICE_PASSWORD') || 'media-proxy-password';
    const churchName = this.configService.get<string>('SLIDES_SERVICE_CHURCH_NAME') || 'Clever Sermon Media';

    try {
      const loginResponse = await this.slidesClient.post<{ access_token: string }>('/auth/login', {
        email,
        password,
      });
      this.cachedSlidesServiceToken = loginResponse.data?.access_token || null;
      return this.cachedSlidesServiceToken;
    } catch (error) {
      const status = (error as any)?.response?.status;
      if (status !== 401 && status !== 404) {
        throw error;
      }

      await this.slidesClient.post('/auth/register', {
        email,
        password,
        churchName,
      });

      const loginResponse = await this.slidesClient.post<{ access_token: string }>('/auth/login', {
        email,
        password,
      });
      this.cachedSlidesServiceToken = loginResponse.data?.access_token || null;
      return this.cachedSlidesServiceToken;
    }
  }

  private async requestSlides<T>(path: string, token: string | null, body?: unknown, serviceToken?: string | null) {
    const request = async (authToken: string | null) => {
      const response = await this.slidesClient.request<T>({
        url: path,
        method: body === undefined ? 'get' : 'post',
        data: body,
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
      });
      return response.data;
    };

    try {
      return await request(token);
    } catch (error) {
      const status = (error as any)?.response?.status;
      if (status === 401) {
        const fallbackToken = serviceToken || (await this.getSlidesServiceToken());
        if (fallbackToken && token !== fallbackToken) {
          return request(fallbackToken);
        }
      }
      throw error;
    }
  }

  async getThemes(token: string | null) {
    return this.requestSlides<Record<string, unknown>[]>('/themes', token);
  }

  async getSermons(token: string | null) {
    return this.requestSlides<Record<string, unknown>[]>('/sermons', token);
  }

  async getDecks(token: string | null) {
    return this.requestSlides<Record<string, unknown>[]>('/decks', token);
  }

  async getChurchSettings(token: string | null) {
    return this.requestSlides<Record<string, unknown>>('/church-settings', token);
  }

  async syncWorkspace(token: string | null, body: unknown) {
    return this.requestSlides<Record<string, unknown>>('/sermons/from-workspace', token, body);
  }

  async generateDeck(token: string | null, sermonId: string, body: unknown) {
    return this.requestSlides<Record<string, unknown>>(`/sermons/${sermonId}/decks`, token, body);
  }

  async updateChurchSettings(token: string | null, body: unknown) {
    const response = await this.slidesClient.request<Record<string, unknown>>({
      url: '/church-settings',
      method: 'patch',
      data: body,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return response.data;
  }

  async generateImage(token: string | null, body: unknown) {
    return this.requestSlides<Record<string, unknown>>('/images/generate', token, body);
  }

  async listImages(token: string | null, workspaceId: string) {
    return this.requestSlides<Record<string, unknown>[]>(`/images/list/${workspaceId}`, token);
  }

  async generateAudio(token: string | null, body: unknown) {
    return this.requestSlides<Record<string, unknown>>('/audio/generate', token, body);
  }

  async listAudio(token: string | null, workspaceId: string) {
    return this.requestSlides<Record<string, unknown>[]>(`/audio/list/${workspaceId}`, token);
  }

  async generateNarrationScript(token: string | null, body: unknown) {
    return this.requestSlides<Record<string, unknown>>('/audio/narration-script', token, body);
  }

  async getVoices(token: string | null, provider?: string) {
    const query = provider ? `?provider=${encodeURIComponent(provider)}` : '';
    return this.requestSlides<Record<string, unknown>[]>(`/audio/voices${query}`, token);
  }

  async getGenres(token: string | null) {
    return this.requestSlides<Record<string, unknown>[]>('/music/genres', token);
  }

  async generateMusic(token: string | null, body: unknown) {
    return this.requestSlides<Record<string, unknown>>('/music/generate', token, body);
  }

  async listMusic(token: string | null, workspaceId: string) {
    return this.requestSlides<Record<string, unknown>[]>(`/music/list/${workspaceId}`, token);
  }

  async generateVideo(token: string | null, body: unknown) {
    return this.requestSlides<Record<string, unknown>>('/video/generate', token, body);
  }

  async listVideo(token: string | null, workspaceId: string) {
    return this.requestSlides<Record<string, unknown>[]>(`/video/list/${workspaceId}`, token);
  }

  async generateSocialKit(token: string | null, body: unknown) {
    return this.requestSlides<Record<string, unknown>>('/social/generate', token, body);
  }

  async listSocial(token: string | null, workspaceId: string) {
    return this.requestSlides<Record<string, unknown>[]>(`/social/list/${workspaceId}`, token);
  }

  async previewSermonSong(token: string | null, body: unknown) {
    return this.requestSlides<Record<string, unknown>>('/music/sermon-song/preview', token, body);
  }

  async proxyToSlides(
    authorization: string | null,
    method: string,
    path: string,
    query: Record<string, unknown>,
    body?: unknown,
  ) {
    const request = async (token: string | null) => {
      const response = await this.slidesClient.request({
        url: path,
        method: method.toLowerCase() as 'get' | 'post' | 'patch' | 'put' | 'delete',
        params: query,
        data: body,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        responseType: 'arraybuffer',
      });

      return {
        status: response.status,
        headers: {
          'content-type': response.headers['content-type'],
          'content-disposition': response.headers['content-disposition'],
        },
        data: Buffer.from(response.data),
      };
    };

    try {
      return await request(authorization);
    } catch (error) {
      const status = (error as any)?.response?.status;
      if (status === 401) {
        const fallbackToken = await this.getSlidesServiceToken();
        if (fallbackToken && fallbackToken !== authorization) {
          return request(fallbackToken);
        }
      }
      throw error;
    }
  }

  async proxyToSlidesAsService(
    method: string,
    path: string,
    query: Record<string, unknown>,
    body?: unknown,
  ) {
    const serviceToken = await this.getSlidesServiceToken();
    const response = await this.slidesClient.request({
      url: path,
      method: method.toLowerCase() as 'get' | 'post' | 'patch' | 'put' | 'delete',
      params: query,
      data: body,
      headers: serviceToken ? { Authorization: `Bearer ${serviceToken}` } : undefined,
      responseType: 'arraybuffer',
    });

    return {
      status: response.status,
      headers: {
        'content-type': response.headers['content-type'],
        'content-disposition': response.headers['content-disposition'],
      },
      data: Buffer.from(response.data),
    };
  }

  async getDeckExports(deckId: string, authorization?: string) {
    const token = this.extractToken(authorization);
    const serviceToken = await this.getSlidesServiceToken();
    return this.requestSlides<Record<string, unknown>[]>(`/decks/${deckId}/exports`, token, undefined, serviceToken);
  }

  async generateSermonSong(token: string | null, body: unknown) {
    return this.requestSlides<Record<string, unknown>>('/music/sermon-song/generate', token, body);
  }

  async generateSermonLyrics(token: string | null, body: unknown) {
    return this.requestSlides<Record<string, unknown>>('/music/sermon-song/lyrics', token, body);
  }

  async updateSermonLyricsDraft(token: string | null, body: unknown) {
    return this.requestSlides<Record<string, unknown>>('/music/sermon-song/lyrics-draft', token, body);
  }

  private getSelectedOutline(workspace: SermonWorkspace) {
    return workspace.outlines?.find((outline) => outline.isSelected) || workspace.outlines?.[0] || null;
  }

  private getSelectedManuscript(workspace: SermonWorkspace) {
    return workspace.manuscripts?.[0] || null;
  }

  private getSelectedStudyReport(workspace: SermonWorkspace) {
    return workspace.studyReports?.[0] || null;
  }

  private normalizeWorkspacePlanning(metadata?: Record<string, any>) {
    const planningSource =
      metadata && typeof metadata === 'object' && metadata.planning && typeof metadata.planning === 'object'
        ? metadata.planning
        : metadata || {};
    const targetLength = Number(planningSource?.targetLengthMinutes);
    const planning: Record<string, any> = {};
    const sermonDate = String(planningSource?.sermonDate || '').trim();
    const serviceType = String(planningSource?.serviceType || '').trim();
    const appealStyle = String(planningSource?.appealStyle || '').trim();
    const ministryMode = String(planningSource?.ministryMode || '').trim();
    const bilingualMode = String(planningSource?.bilingualMode || '').trim();

    if (sermonDate) planning.sermonDate = sermonDate;
    if (Number.isFinite(targetLength) && targetLength > 0) planning.targetLengthMinutes = Math.round(targetLength);
    if (serviceType) planning.serviceType = serviceType;
    if (appealStyle) planning.appealStyle = appealStyle;
    if (ministryMode) planning.ministryMode = ministryMode;
    if (bilingualMode) planning.bilingualMode = bilingualMode;

    return planning;
  }

  private normalizeSlidesTone(value: unknown): 'hopeful' | 'urgent' | 'reflective' | 'challenging' | 'encouraging' {
    const text = String(value || '').toLowerCase();
    if (text.includes('urgent') || text.includes('warning') || text.includes('appeal') || text.includes('decision')) {
      return 'urgent';
    }
    if (text.includes('reflect')) {
      return 'reflective';
    }
    if (text.includes('challenge') || text.includes('confront')) {
      return 'challenging';
    }
    if (text.includes('hope') || text.includes('comfort')) {
      return 'hopeful';
    }
    return 'encouraging';
  }

  private normalizeDeckIntent(value: unknown): 'sermon_presentation' | 'social_summary' | 'teaching_study' | 'youth_message' | 'evangelistic_appeal' {
    const text = String(value || '').toLowerCase().trim();
    if (
      text === 'social_summary' ||
      text === 'teaching_study' ||
      text === 'youth_message' ||
      text === 'evangelistic_appeal'
    ) {
      return text;
    }
    return 'sermon_presentation';
  }

  private deckModeLabel(intent: string) {
    switch (intent) {
      case 'social_summary':
        return 'Social Promo / Summary Deck';
      case 'teaching_study':
        return 'Teaching Study Deck';
      case 'youth_message':
        return 'Youth Message Deck';
      case 'evangelistic_appeal':
        return 'Evangelistic Appeal Deck';
      default:
        return 'Sermon Presentation Deck';
    }
  }

  private buildSyncPayload(workspace: SermonWorkspace) {
    const selectedOutline = this.getSelectedOutline(workspace);
    const selectedManuscript = this.getSelectedManuscript(workspace);
    const selectedStudyReport = this.getSelectedStudyReport(workspace);
    const planning = this.normalizeWorkspacePlanning(workspace.metadata as Record<string, any>);
    const outlinePoints = Array.isArray((selectedOutline as any)?.structure?.points)
      ? (selectedOutline as any).structure.points
      : [];
    const pointNodes = Array.isArray((selectedOutline as any)?.structure?.pointNodes)
      ? (selectedOutline as any).structure.pointNodes
      : [];
    const mainPoints = (outlinePoints.length ? outlinePoints : pointNodes)
      .map((point: any) => String(point?.title || point?.summary || point?.text || point?.content || point || '').trim())
      .filter(Boolean);
    const notes = [
      String((selectedManuscript as any)?.content?.text || (selectedManuscript as any)?.content || '').trim(),
      String((selectedStudyReport as any)?.sections?.summary || '').trim(),
      String((selectedStudyReport as any)?.sections?.interpretiveCenter || '').trim(),
      String((selectedStudyReport as any)?.sections?.mainTension || '').trim(),
    ].filter(Boolean).join('\n\n');

    return {
      workspaceId: workspace.id,
      title: workspace.title,
      seriesTitle: workspace.seriesTitle || undefined,
      language: workspace.language || 'en',
      mainScriptureRef: workspace.mainPassage,
      bigIdea: workspace.theme || workspace.sermonGoals || workspace.sermonCore?.bigIdea || workspace.title,
      mainPoints,
      audienceContext: workspace.audienceProfile || undefined,
      tone: this.normalizeSlidesTone(workspace.sermonCore?.sermonGoal || workspace.theme || workspace.sermonGoals || workspace.title),
      notes,
      outline: selectedOutline || undefined,
      manuscript: selectedManuscript || undefined,
      applications: workspace.applications || [],
      questions: workspace.discussionQuestions || [],
      planning: {
        title: workspace.title,
        seriesTitle: workspace.seriesTitle || undefined,
        mainPassage: workspace.mainPassage,
        additionalPassages: Array.isArray(workspace.additionalPassages) ? workspace.additionalPassages : [],
        language: workspace.language || 'en',
        theologicalLens: workspace.theologicalLens || undefined,
        style: workspace.style || undefined,
        storyArc: workspace.storyArc || undefined,
        theme: workspace.theme || undefined,
        audienceProfile: workspace.audienceProfile || undefined,
        sermonGoals: workspace.sermonGoals || undefined,
        sermonDate: planning.sermonDate || undefined,
        targetLengthMinutes: planning.targetLengthMinutes || undefined,
        serviceType: planning.serviceType || undefined,
        appealStyle: planning.appealStyle || undefined,
        ministryMode: planning.ministryMode || undefined,
        bilingualMode: planning.bilingualMode || undefined,
        egwEnabled: workspace.egwEnabled,
        guardrailMode: (workspace.metadata as Record<string, any>)?.guardrailMode || undefined,
        guardrailDetected: Boolean((workspace.metadata as Record<string, any>)?.guardrailDetected),
      },
    };
  }

  private async persistManifest(workspace: SermonWorkspace, manifest: MediaPackManifest) {
    workspace.metadata = {
      ...(workspace.metadata || {}),
      mediaPack: manifest,
      exportPack: manifest,
      activeSermonDeckId: manifest.activeSermonDeckId || null,
      activeSocialDeckId: manifest.activeSocialDeckId || null,
      latestDeckByIntent: manifest.latestDeckByIntent || {},
      archivedDeckIds: manifest.archivedDeckIds || [],
      deliverables: {
        ...((workspace.metadata as Record<string, any>)?.deliverables || {}),
        mediaPack: manifest,
        export: manifest,
      },
    };
    return this.workspaceRepository.save(workspace);
  }

  async composeMediaPack(
    workspaceId: string,
    userId: string,
    authorization?: string,
    dto: ComposeMediaPackDto = {},
  ) {
    const workspace = await this.workspacesService.findOne(workspaceId, userId);
    if (!workspace) {
      throw new BadRequestException('Workspace not found');
    }

    const token = this.extractToken(authorization);
    const syncPayload = this.buildSyncPayload(workspace);
    const deckIntent = this.normalizeDeckIntent(dto.deckIntent);
    const sermon = await this.requestSlides<Record<string, unknown>>('/sermons/from-workspace', token, syncPayload);
    const planning = this.normalizeWorkspacePlanning(workspace.metadata as Record<string, any>);
    const resolvedDeckSize =
      dto.deckSize ||
      (deckIntent === 'sermon_presentation'
        ? (planning.targetLengthMinutes && planning.targetLengthMinutes >= 35 ? 'long' : 'standard')
        : 'short');

    const deckResult = dto.includeDeck === false
      ? null
      : await this.requestSlides<Record<string, unknown>>(`/sermons/${String((sermon as any).id || (sermon as any).sermonId)}/decks`, token, {
          themeId: dto.themeId,
          deckSize: resolvedDeckSize,
          deckIntent,
          backgroundProvider: dto.backgroundProvider || 'local',
          backgroundPreset: dto.backgroundPreset,
        });

    const deckId = String((deckResult as any)?.id || (deckResult as any)?.deckId || '');
    const metadata = (workspace.metadata || {}) as Record<string, any>;
    const latestDeckByIntent = {
      ...(metadata.latestDeckByIntent || {}),
      [deckIntent]: deckId || null,
    };
    const activeSermonDeckId =
      deckIntent === 'sermon_presentation'
        ? deckId || metadata.activeSermonDeckId || null
        : metadata.activeSermonDeckId || latestDeckByIntent.sermon_presentation || null;
    const activeSocialDeckId =
      deckIntent === 'social_summary'
        ? deckId || metadata.activeSocialDeckId || null
        : metadata.activeSocialDeckId || latestDeckByIntent.social_summary || null;
    const exportArtifacts: SlideExportArtifact[] = [];
    for (const type of dto.exportTypes || []) {
      try {
        const exportEntity = await this.requestSlides<Record<string, unknown>>(`/decks/${deckId}/exports`, token, { type });
        exportArtifacts.push({
          type,
          label: type === 'pptx' ? 'Slide deck' : 'Slide deck PDF',
          status: String((exportEntity as any)?.status || 'ready'),
          fileUrl: (exportEntity as any)?.fileUrl || null,
        });
      } catch (error) {
        const message = String((error as any)?.response?.data?.message || (error as Error)?.message || 'Export unavailable');
        exportArtifacts.push({
          type,
          label: type === 'pptx' ? 'Slide deck' : 'Slide deck PDF',
          status: message.toLowerCase().includes('unsupported export type') ? 'unavailable' : 'failed',
          fileUrl: null,
        });
      }
    }

    const selectedOutline = this.getSelectedOutline(workspace);
    const selectedManuscript = this.getSelectedManuscript(workspace);
    const selectedStudyReport = this.getSelectedStudyReport(workspace);
    const slideCount = Array.isArray((deckResult as any)?.slides) ? (deckResult as any).slides.length : undefined;
    const warnings: string[] = [];
    if (deckIntent === 'sermon_presentation' && typeof slideCount === 'number' && slideCount > 0 && slideCount < 8) {
      warnings.push('Deck is shorter than a typical sermon presentation. Add outline points or mark this as a social_summary deck.');
    }
    if (deckIntent === 'social_summary' && typeof slideCount === 'number' && slideCount > 5) {
      warnings.push('Social summary decks should stay short. Trim to 3-5 slides.');
    }

    const manifest: MediaPackManifest = {
      status: exportArtifacts.length ? 'ready' : 'draft',
      generatedAt: new Date().toISOString(),
      sourceOutlineId: selectedOutline?.id || null,
      sourceManuscriptId: selectedManuscript?.id || null,
      sourceStudyReportId: selectedStudyReport?.id || null,
      deckIntent,
      deckModeLabel: this.deckModeLabel(deckIntent),
      activeSermonDeckId,
      activeSocialDeckId,
      latestDeckByIntent,
      archivedDeckIds: Array.isArray(metadata.archivedDeckIds) ? metadata.archivedDeckIds.filter(Boolean).map(String) : [],
      slideCount,
      deckId: deckId || null,
      sermonId: String((sermon as any)?.id || (sermon as any)?.sermonId || ''),
      exportPrepared: exportArtifacts.length > 0,
      warnings,
      artifacts: exportArtifacts,
    };

    await this.persistManifest(workspace, manifest);

    return {
      sermon,
      deck: deckResult,
      manifest,
      exports: exportArtifacts,
    };
  }
}
