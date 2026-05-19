import { All, Body, Controller, Get, Headers, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceMediaPackService } from './workspace-media-pack.service';
import type { Request, Response } from 'express';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaProxyController {
  constructor(private readonly workspaceMediaPackService: WorkspaceMediaPackService) {}

  @Get('themes')
  getThemes(@Headers('authorization') authorization?: string) {
    return this.workspaceMediaPackService.getThemes(this.extractToken(authorization));
  }

  @Get('sermons')
  getSermons(@Headers('authorization') authorization?: string) {
    return this.workspaceMediaPackService.getSermons(this.extractToken(authorization));
  }

  @Get('decks')
  getDecks(@Headers('authorization') authorization?: string) {
    return this.workspaceMediaPackService.getDecks(this.extractToken(authorization));
  }

  @Get('images/list/:workspaceId')
  getImages(@Param('workspaceId') workspaceId: string, @Headers('authorization') authorization?: string) {
    return this.workspaceMediaPackService.listImages(this.extractToken(authorization), workspaceId);
  }

  @Get('audio/list/:workspaceId')
  getAudio(@Param('workspaceId') workspaceId: string, @Headers('authorization') authorization?: string) {
    return this.workspaceMediaPackService.listAudio(this.extractToken(authorization), workspaceId);
  }

  @Get('music/list/:workspaceId')
  getMusic(@Param('workspaceId') workspaceId: string, @Headers('authorization') authorization?: string) {
    return this.workspaceMediaPackService.listMusic(this.extractToken(authorization), workspaceId);
  }

  @Get('video/list/:workspaceId')
  getVideo(@Param('workspaceId') workspaceId: string, @Headers('authorization') authorization?: string) {
    return this.workspaceMediaPackService.listVideo(this.extractToken(authorization), workspaceId);
  }

  @Get('social/list/:workspaceId')
  getSocial(@Param('workspaceId') workspaceId: string, @Headers('authorization') authorization?: string) {
    return this.workspaceMediaPackService.listSocial(this.extractToken(authorization), workspaceId);
  }

  @Get('church-settings')
  getChurchSettings(@Headers('authorization') authorization?: string) {
    return this.workspaceMediaPackService.getChurchSettings(this.extractToken(authorization));
  }

  @Patch('church-settings')
  updateChurchSettings(@Headers('authorization') authorization?: string, @Body() body?: unknown) {
    return this.workspaceMediaPackService.updateChurchSettings(this.extractToken(authorization), body || {});
  }

  @Post('sync-workspace')
  syncWorkspace(@Headers('authorization') authorization?: string, @Body() body?: unknown) {
    return this.workspaceMediaPackService.syncWorkspace(this.extractToken(authorization), body || {});
  }

  @Post('sermons/:sermonId/decks')
  generateDeck(
    @Param('sermonId') sermonId: string,
    @Headers('authorization') authorization?: string,
    @Body() body?: unknown,
  ) {
    return this.workspaceMediaPackService.generateDeck(this.extractToken(authorization), sermonId, body || {});
  }

  @Post('images/generate')
  generateImage(@Headers('authorization') authorization?: string, @Body() body?: unknown) {
    return this.workspaceMediaPackService.generateImage(this.extractToken(authorization), body || {});
  }

  @Post('audio/generate')
  generateAudio(@Headers('authorization') authorization?: string, @Body() body?: unknown) {
    return this.workspaceMediaPackService.generateAudio(this.extractToken(authorization), body || {});
  }

  @Post('audio/narration-script')
  generateNarrationScript(@Headers('authorization') authorization?: string, @Body() body?: unknown) {
    return this.workspaceMediaPackService.generateNarrationScript(this.extractToken(authorization), body || {});
  }

  @Get('audio/voices')
  getVoices(@Headers('authorization') authorization?: string, @Query('provider') provider?: string) {
    return this.workspaceMediaPackService.getVoices(this.extractToken(authorization), provider);
  }

  @Get('music/genres')
  getGenres(@Headers('authorization') authorization?: string) {
    return this.workspaceMediaPackService.getGenres(this.extractToken(authorization));
  }

  @Post('music/generate')
  generateMusic(@Headers('authorization') authorization?: string, @Body() body?: unknown) {
    return this.workspaceMediaPackService.generateMusic(this.extractToken(authorization), body || {});
  }

  @Post('music/sermon-song/generate')
  generateSermonSong(@Headers('authorization') authorization?: string, @Body() body?: unknown) {
    return this.workspaceMediaPackService.generateSermonSong(this.extractToken(authorization), body || {});
  }

  @Post('music/sermon-song/preview')
  previewSermonSong(@Headers('authorization') authorization?: string, @Body() body?: unknown) {
    return this.workspaceMediaPackService.previewSermonSong(this.extractToken(authorization), body || {});
  }

  @Post('music/sermon-song/lyrics')
  generateSermonLyrics(@Headers('authorization') authorization?: string, @Body() body?: unknown) {
    return this.workspaceMediaPackService.generateSermonLyrics(this.extractToken(authorization), body || {});
  }

  @Post('music/sermon-song/lyrics-draft')
  updateSermonLyricsDraft(@Headers('authorization') authorization?: string, @Body() body?: unknown) {
    return this.workspaceMediaPackService.updateSermonLyricsDraft(this.extractToken(authorization), body || {});
  }

  @Post('video/generate')
  generateVideo(@Headers('authorization') authorization?: string, @Body() body?: unknown) {
    return this.workspaceMediaPackService.generateVideo(this.extractToken(authorization), body || {});
  }

  @Post('social/generate')
  generateSocialKit(@Headers('authorization') authorization?: string, @Body() body?: unknown) {
    return this.workspaceMediaPackService.generateSocialKit(this.extractToken(authorization), body || {});
  }

  @Get('decks/:deckId/exports')
  getDeckExports(@Param('deckId') deckId: string, @Headers('authorization') authorization?: string) {
    return this.workspaceMediaPackService.getDeckExports(deckId, authorization);
  }

  @Post('decks/:deckId/exports')
  async exportDeck(
    @Param('deckId') deckId: string,
    @Res() res: Response,
    @Body() body?: unknown,
    @Query() query: Record<string, unknown> = {},
    @Headers('authorization') authorization?: string,
  ) {
    const proxied = await this.workspaceMediaPackService.proxyToSlides(
      this.extractToken(authorization),
      'post',
      `/decks/${deckId}/exports`,
      query || {},
      body || {},
    );
    return this.sendProxiedResponse(res, proxied);
  }

  @Get('exports/:id/download')
  async downloadExport(
    @Param('id') id: string,
    @Res() res: Response,
    @Query() query: Record<string, unknown> = {},
    @Headers('authorization') authorization?: string,
  ) {
    const proxied = await this.workspaceMediaPackService.proxyToSlides(
      this.extractToken(authorization),
      'get',
      `/exports/${id}/download`,
      query || {},
    );
    return this.sendProxiedResponse(res, proxied);
  }

  @All('*')
  async proxyRemaining(@Req() req: Request, @Res() res: Response, @Headers('authorization') authorization?: string) {
    const url = new URL(req.originalUrl, 'http://localhost');
    const path = url.pathname.replace(/^\/api\/v1\/media/, '') || '/';
    const proxied = await this.workspaceMediaPackService.proxyToSlides(
      this.extractToken(authorization),
      req.method,
      path,
      Object.fromEntries(url.searchParams.entries()),
      req.body,
    );

    res.status(proxied.status);
    Object.entries(proxied.headers || {}).forEach(([key, value]) => {
      const lower = key.toLowerCase();
      if (['content-length', 'transfer-encoding', 'connection'].includes(lower)) return;
      if (Array.isArray(value)) {
        res.setHeader(key, value.join(', '));
      } else if (value !== undefined) {
        res.setHeader(key, String(value));
      }
    });

    const contentType = String(proxied.headers?.['content-type'] || proxied.headers?.['Content-Type'] || '');
    if (contentType.includes('application/json')) {
      try {
        return res.json(JSON.parse(Buffer.from(proxied.data).toString('utf8')));
      } catch {
        return res.send(Buffer.from(proxied.data).toString('utf8'));
      }
    }

    return res.send(Buffer.from(proxied.data));
  }

  private extractToken(authorization?: string) {
    const raw = String(authorization || '').trim();
    if (!raw) return null;
    return raw.toLowerCase().startsWith('bearer ') ? raw.slice(7).trim() : raw;
  }

  private sendProxiedResponse(res: Response, proxied: { status: number; headers?: Record<string, unknown>; data: Buffer }) {
    res.status(proxied.status);
    Object.entries(proxied.headers || {}).forEach(([key, value]) => {
      const lower = key.toLowerCase();
      if (['content-length', 'transfer-encoding', 'connection'].includes(lower)) return;
      if (Array.isArray(value)) {
        res.setHeader(key, value.join(', '));
      } else if (value !== undefined) {
        res.setHeader(key, String(value));
      }
    });
    return res.send(proxied.data);
  }
}
