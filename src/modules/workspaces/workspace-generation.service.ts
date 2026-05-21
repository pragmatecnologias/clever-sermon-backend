import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { WorkspaceGenerationCapability, WorkspaceGenerationRegistry } from './workspace-generation.registry';
import { WorkspacesService } from './workspaces.service';

export type WorkspaceGenerationJobPayload = {
  workspaceId: string;
  userId: string;
  capability: WorkspaceGenerationCapability;
  promptOverride?: string;
  includeEGW?: boolean;
};

export type ManuscriptRepairQueuePayload = {
  workspaceId: string;
  manuscriptId: string;
  userId: string;
  selectedIssueIds: string[];
  doNotTouchAnchors: string[];
  conversationSummary: string;
  mode: 'targeted';
};

@Injectable()
export class WorkspaceGenerationService {
  constructor(
    @InjectQueue('workspace-generation')
    private readonly workspaceGenerationQueue: Queue,
    @InjectQueue('manuscript-repair')
    private readonly manuscriptRepairQueue: Queue,
    private readonly workspacesService: WorkspacesService,
  ) {}

  async queueWorkspaceGeneration(
    workspaceId: string,
    userId: string,
    capability: WorkspaceGenerationCapability,
    promptOverride?: string,
    includeEGW = false,
  ) {
    const job = await this.workspaceGenerationQueue.add('generate', {
      workspaceId,
      userId,
      capability,
      promptOverride,
      includeEGW,
    } satisfies WorkspaceGenerationJobPayload, {
      attempts: 2,
      removeOnComplete: 50,
      removeOnFail: 50,
    });
    return {
      jobId: String(job.id),
      status: 'queued',
      workspaceId,
      capability,
    };
  }

  async getWorkspaceGenerationJobStatus(workspaceId: string, jobId: string, userId: string) {
    const job = await this.workspaceGenerationQueue.getJob(jobId);
    if (!job) {
      throw new BadRequestException('Generation job not found.');
    }
    const data = (job.data || {}) as WorkspaceGenerationJobPayload;
    if (data.workspaceId !== workspaceId || data.userId !== userId) {
      throw new BadRequestException('Generation job does not belong to this workspace.');
    }

    const state = await job.getState();
    const progress = (job.progress() || {}) as { state?: string; message?: string };
    if (state === 'completed') {
      return {
        jobId,
        status: 'completed',
        state: 'completed',
        result: job.returnvalue || null,
      };
    }
    if (state === 'failed') {
      return {
        jobId,
        status: 'failed',
        state: 'failed',
        error: job.failedReason || 'Generation job failed.',
      };
    }
    return {
      jobId,
      status: state === 'active' ? (progress.state || 'running') : 'queued',
      state: progress.state || (state === 'active' ? 'running' : 'queued'),
      message: progress.message || '',
    };
  }

  async enqueueManuscriptRepair(
    workspaceId: string,
    manuscriptId: string,
    userId: string,
    payload: {
      selectedIssueIds?: string[];
      doNotTouchAnchors?: string[];
      conversationSummary?: string;
      mode?: 'targeted' | string;
    },
  ) {
    const job = await this.manuscriptRepairQueue.add('repair', {
      workspaceId,
      manuscriptId,
      userId,
      selectedIssueIds: payload.selectedIssueIds || [],
      doNotTouchAnchors: payload.doNotTouchAnchors || [],
      conversationSummary: payload.conversationSummary || '',
      mode: 'targeted',
    } satisfies ManuscriptRepairQueuePayload, {
      attempts: 2,
      removeOnComplete: 50,
      removeOnFail: 50,
    });
    return {
      jobId: String(job.id),
      status: 'queued',
      manuscriptId,
    };
  }

  async getManuscriptRepairJobStatus(workspaceId: string, manuscriptId: string, jobId: string, userId: string) {
    const job = await this.manuscriptRepairQueue.getJob(jobId);
    if (!job) {
      throw new BadRequestException('Repair job not found.');
    }
    const data = (job.data || {}) as ManuscriptRepairQueuePayload;
    if (data.workspaceId !== workspaceId || data.manuscriptId !== manuscriptId || data.userId !== userId) {
      throw new BadRequestException('Repair job does not belong to this manuscript.');
    }

    const state = await job.getState();
    const progress = (job.progress() || {}) as { state?: string; message?: string; touchedAnchors?: string[] };
    if (state === 'completed') {
      return {
        jobId,
        status: 'completed',
        state: 'completed',
        result: job.returnvalue || null,
      };
    }
    if (state === 'failed') {
      return {
        jobId,
        status: 'failed',
        state: 'failed',
        error: job.failedReason || 'Repair job failed.',
      };
    }
    return {
      jobId,
      status: state === 'active' ? (progress.state || 'patching') : 'queued',
      state: progress.state || (state === 'active' ? 'patching' : 'queued'),
      message: progress.message || '',
      touchedAnchors: progress.touchedAnchors || [],
    };
  }

  validateGenerationResult(capability: WorkspaceGenerationCapability, parsed: unknown) {
    const registryEntry = WorkspaceGenerationRegistry[capability];
    const validation = registryEntry.validate(parsed);
    if (!validation.ok) {
      throw new BadRequestException(
        `${registryEntry.description} validation failed: ${validation.issues.join('; ')}`,
      );
    }
    return validation;
  }

  async processWorkspaceGenerationJob(
    payload: WorkspaceGenerationJobPayload,
    job?: Job<WorkspaceGenerationJobPayload>,
  ) {
    const setStage = async (state: string, message: string) => {
      if (job) {
        await job.progress({ state, message });
      }
    };

    await setStage('loading', 'Loading workspace.');
    await this.workspacesService.findOne(payload.workspaceId, payload.userId);
    if (payload.capability === 'study-report') {
      await setStage('study-report', 'Generating study report.');
      const report = await this.workspacesService.generateStudyReport(payload.workspaceId, payload.userId, payload.promptOverride);
      this.validateGenerationResult('study-report', (report as any)?.sections || report);
      await setStage('completed', 'Study report completed.');
      return report;
    }
    if (payload.capability === 'outline-points' || payload.capability === 'outline') {
      await setStage('outline', 'Generating outlines.');
      const result =
        payload.capability === 'outline-points'
          ? await this.workspacesService.generateOutlines(payload.workspaceId, payload.userId, 1, payload.promptOverride)
          : await this.workspacesService.generateOutlines(payload.workspaceId, payload.userId, 1, payload.promptOverride);
      if (payload.capability === 'outline-points') {
        this.validateGenerationResult(
          'outline-points',
          result.map((outline) => ({
            points: outline.structure?.points || outline.structure?.pointNodes || [],
            angle: outline.title,
          })),
        );
      } else {
        this.validateGenerationResult('outline', result[0]?.structure || {});
      }
      await setStage('completed', 'Outline generation completed.');
      return result;
    }
    if (payload.capability === 'manuscript') {
      await setStage('manuscript', 'Generating manuscript.');
      const workspace = await this.workspacesService.findOne(payload.workspaceId, payload.userId);
      const selectedOutline =
        (workspace.outlines || []).find((outline) => outline?.isSelected) ||
        (workspace.outlines || [])[0];
      if (!selectedOutline?.id) {
        throw new BadRequestException('No selected outline found for manuscript generation.');
      }
      const result = await this.workspacesService.generateManuscript(
        payload.workspaceId,
        selectedOutline.id,
        payload.userId,
        payload.promptOverride,
      );
      this.validateGenerationResult('manuscript', result);
      await setStage('completed', 'Manuscript generation completed.');
      return result;
    }
    if (payload.capability === 'sermon-core') {
      await setStage('sermon-core', 'Generating sermon core.');
      const result = await this.workspacesService.generateSermonCore(payload.workspaceId, payload.userId);
      this.validateGenerationResult('sermon-core', result);
      await setStage('completed', 'Sermon core completed.');
      return result;
    }
    if (payload.capability === 'integrity-check') {
      await setStage('integrity-check', 'Running integrity review.');
      const result = await this.workspacesService.runIntegrityCheck(payload.workspaceId, payload.userId);
      this.validateGenerationResult('integrity-check', result);
      await setStage('completed', 'Integrity review completed.');
      return result;
    }
    if (payload.capability === 'applications') {
      await setStage('applications', 'Generating applications.');
      const result = await this.workspacesService.generateApplications(payload.workspaceId, payload.userId, payload.promptOverride);
      this.validateGenerationResult('applications', result);
      await setStage('completed', 'Applications completed.');
      return result;
    }
    if (payload.capability === 'discussion-questions') {
      await setStage('discussion-questions', 'Generating discussion questions.');
      const result = await this.workspacesService.generateDiscussionQuestions(
        payload.workspaceId,
        payload.userId,
        payload.promptOverride,
      );
      this.validateGenerationResult('discussion-questions', result);
      await setStage('completed', 'Discussion questions completed.');
      return result;
    }
    if (payload.capability === 'illustrations') {
      await setStage('illustrations', 'Generating illustration ideas.');
      const result = await this.workspacesService.generateIllustrations(payload.workspaceId, payload.userId, payload.promptOverride);
      this.validateGenerationResult('illustrations', result);
      await setStage('completed', 'Illustrations completed.');
      return result;
    }
    if (payload.capability === 'citations') {
      await setStage('citations', 'Generating citations.');
      const result = await this.workspacesService.generateCitations(payload.workspaceId, payload.userId, payload.promptOverride);
      this.validateGenerationResult('citations', result);
      await setStage('completed', 'Citations completed.');
      return result;
    }
    if (payload.capability === 'media-suggestions') {
      await setStage('media-suggestions', 'Generating media suggestions.');
      const result = await this.workspacesService.generateMediaSuggestions(
        payload.workspaceId,
        payload.userId,
        payload.promptOverride,
      );
      this.validateGenerationResult('media-suggestions', result);
      await setStage('completed', 'Media suggestions completed.');
      return result;
    }
    await setStage('failed', `Unsupported capability: ${payload.capability}`);
    throw new BadRequestException(`Unsupported generation capability: ${payload.capability}`);
  }

  async processManuscriptRepairJob(
    payload: ManuscriptRepairQueuePayload,
    job?: Job<ManuscriptRepairQueuePayload>,
  ) {
    const setStage = async (state: string, message: string, touchedAnchors: string[] = []) => {
      if (job) {
        await job.progress({ state, message, touchedAnchors });
      }
      console.info(
        '[manuscript-repair]',
        JSON.stringify({
          tag: 'manuscript_repair_stage',
          workspaceId: payload.workspaceId,
          manuscriptId: payload.manuscriptId,
          state,
          message,
          touchedAnchors,
        }),
      );
    };

    await setStage('planning', 'Preparing targeted repair plan.');
    const result = await this.workspacesService.applyTargetedManuscriptRepair(payload, setStage);
    await setStage('completed', 'Targeted repair completed.', result?.touchedAnchors || []);
    return result;
  }
}
