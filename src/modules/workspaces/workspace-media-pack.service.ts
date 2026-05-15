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
  slideCount?: number;
  deckId?: string | null;
  sermonId?: string | null;
  exportPrepared: boolean;
  artifacts: SlideExportArtifact[];
};

@Injectable()
export class WorkspaceMediaPackService {
  private readonly slidesClient: AxiosInstance;

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

  private async requestSlides<T>(path: string, token: string | null, body?: unknown) {
    const response = await this.slidesClient.request<T>({
      url: path,
      method: body === undefined ? 'get' : 'post',
      data: body,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return response.data;
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

  async generateAudio(token: string | null, body: unknown) {
    return this.requestSlides<Record<string, unknown>>('/audio/generate', token, body);
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

  async generateVideo(token: string | null, body: unknown) {
    return this.requestSlides<Record<string, unknown>>('/video/generate', token, body);
  }

  async generateSocialKit(token: string | null, body: unknown) {
    return this.requestSlides<Record<string, unknown>>('/social/generate', token, body);
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
    const response = await this.slidesClient.request({
      url: path,
      method: method.toLowerCase() as 'get' | 'post' | 'patch' | 'put' | 'delete',
      params: query,
      data: body,
      headers: authorization ? { Authorization: `Bearer ${authorization}` } : undefined,
      responseType: 'arraybuffer',
      validateStatus: () => true,
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

  private buildSyncPayload(workspace: SermonWorkspace) {
    const selectedOutline = this.getSelectedOutline(workspace);
    const selectedManuscript = this.getSelectedManuscript(workspace);
    const selectedStudyReport = this.getSelectedStudyReport(workspace);
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
      tone: workspace.sermonCore?.sermonGoal || undefined,
      notes,
      outline: selectedOutline || undefined,
      manuscript: selectedManuscript || undefined,
      applications: workspace.applications || [],
      questions: workspace.discussionQuestions || [],
    };
  }

  private async persistManifest(workspace: SermonWorkspace, manifest: MediaPackManifest) {
    workspace.metadata = {
      ...(workspace.metadata || {}),
      mediaPack: manifest,
      exportPack: manifest,
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
    const sermon = await this.requestSlides<Record<string, unknown>>('/sermons/from-workspace', token, syncPayload);

    const deckResult = dto.includeDeck === false
      ? null
      : await this.requestSlides<Record<string, unknown>>(`/sermons/${String((sermon as any).id || (sermon as any).sermonId)}/decks`, token, {
          themeId: dto.themeId,
          deckSize: dto.deckSize || 'long',
          backgroundProvider: dto.backgroundProvider || 'local',
          backgroundPreset: dto.backgroundPreset,
        });

    const deckId = String((deckResult as any)?.id || (deckResult as any)?.deckId || '');
    const exportArtifacts: SlideExportArtifact[] = [];
    for (const type of dto.exportTypes || []) {
      const exportEntity = await this.requestSlides<Record<string, unknown>>(`/decks/${deckId}/exports`, token, { type });
      exportArtifacts.push({
        type,
        label: type === 'pptx' ? 'Slide deck' : 'Slide deck PDF',
        status: String((exportEntity as any)?.status || 'ready'),
        fileUrl: (exportEntity as any)?.fileUrl || null,
      });
    }

    const selectedOutline = this.getSelectedOutline(workspace);
    const selectedManuscript = this.getSelectedManuscript(workspace);
    const selectedStudyReport = this.getSelectedStudyReport(workspace);
    const slideCount = Array.isArray((deckResult as any)?.slides) ? (deckResult as any).slides.length : undefined;

    const manifest: MediaPackManifest = {
      status: exportArtifacts.length ? 'ready' : 'draft',
      generatedAt: new Date().toISOString(),
      sourceOutlineId: selectedOutline?.id || null,
      sourceManuscriptId: selectedManuscript?.id || null,
      sourceStudyReportId: selectedStudyReport?.id || null,
      slideCount,
      deckId: deckId || null,
      sermonId: String((sermon as any)?.id || (sermon as any)?.sermonId || ''),
      exportPrepared: exportArtifacts.length > 0,
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
