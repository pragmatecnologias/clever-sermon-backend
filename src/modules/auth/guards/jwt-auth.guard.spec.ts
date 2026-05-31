import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('allows signed media download URLs with a query token', () => {
    const guard = new JwtAuthGuard();
    const result = guard.canActivate({
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          path: '/api/v1/media/audio/123/download',
          query: { token: 'signed-token' },
        }),
      }),
    } as any);

    expect(result).toBe(true);
  });
});
