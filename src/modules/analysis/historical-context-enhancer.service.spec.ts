import { HistoricalContextEnhancerService } from './historical-context-enhancer.service';

describe('HistoricalContextEnhancerService get()', () => {
  it('returns the most recent historical context row for a workspace', async () => {
    const repository = {
      find: jest.fn().mockResolvedValue([
        {
          id: 'latest-context',
          workspaceId: 'workspace-1',
          passage: 'Psalm 37:23-24',
          createdAt: new Date('2026-05-24T14:05:00.000Z'),
        },
        {
          id: 'older-context',
          workspaceId: 'workspace-1',
          passage: 'Psalm 37:23-24',
          createdAt: new Date('2026-05-24T13:05:00.000Z'),
        },
      ]),
    };

    const service = new HistoricalContextEnhancerService(
      repository as any,
      null as any,
      null as any,
      null as any,
    );

    await expect(service.get('workspace-1')).resolves.toMatchObject({
      id: 'latest-context',
      workspaceId: 'workspace-1',
      passage: 'Psalm 37:23-24',
    });

    expect(repository.find).toHaveBeenCalledWith({
      where: { workspaceId: 'workspace-1' },
      order: { createdAt: 'DESC' },
      take: 1,
    });
  });
});
