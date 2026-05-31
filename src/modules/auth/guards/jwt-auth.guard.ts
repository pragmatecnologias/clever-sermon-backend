import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly scriptureProtectedRoutes = new Set([
    'passage',
    'passage-with-context',
    'parallel',
    'cross-references',
    'audio-bibles',
    'cross-reference-details',
    'word-study',
    'word-study-insights',
    'word-study-suggestions',
    'search',
    'translations',
    'context',
    'translation-comparison',
    'morphology',
    'theme-extraction',
    'evidence-map',
    'passage-integrity',
    'cross-references-ranked',
    'cross-references-top',
    'cross-references-sop-linked',
    'cross-references-edges',
    'interpretive-highlights',
    'interpretive-highlights-formatted',
    'sda-contextual-references',
    'sda-interpretive-frame',
    'validate-citation',
    'validate-citations-bulk',
    'verse-commentary',
    'morphology-data',
    'canonical-themes',
    'sanctuary-connections',
    'prophecy-connections',
    'sanctuary-threads',
    'prophecy-threads',
    'structural-analysis',
    'interpretive-challenge',
    'interpretive-challenges',
    'word-study-enhanced',
    'word-study-by-lemma',
    'verse-context',
    'passage-summary',
    'study-synthesis',
    'translation-comparison-enhanced',
  ]);

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const path: string = request?.path || '';
    const queryToken = String(request?.query?.token || '').trim();

    if (request?.method === 'GET' && path.startsWith('/api/v1/scripture/')) {
      const tail = path.replace('/api/v1/scripture/', '');
      const isSingleSegment = tail.length > 0 && !tail.includes('/');
      if (isSingleSegment && !this.scriptureProtectedRoutes.has(tail)) {
        return true;
      }
    }

    if (request?.method === 'GET' && path.startsWith('/api/v1/media/') && path.includes('/download') && queryToken) {
      return true;
    }

    return super.canActivate(context);
  }
}
