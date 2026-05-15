import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { WorkspaceGenerationService } from './workspace-generation.service';

@Processor('workspace-generation')
export class WorkspaceGenerationProcessor {
  constructor(private readonly workspaceGenerationService: WorkspaceGenerationService) {}

  @Process('generate')
  async handleGenerate(job: Job<any>) {
    return this.workspaceGenerationService.processWorkspaceGenerationJob(job.data, job);
  }
}
