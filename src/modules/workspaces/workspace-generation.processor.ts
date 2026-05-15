import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { WorkspacesService } from './workspaces.service';

@Processor('workspace-generation')
export class WorkspaceGenerationProcessor {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Process('generate')
  async handleGenerate(job: Job<any>) {
    return this.workspacesService.processWorkspaceGenerationJob(job.data, job);
  }
}
