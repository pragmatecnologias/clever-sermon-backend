import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { WorkspacesService } from './workspaces.service';

@Processor('manuscript-repair')
export class ManuscriptRepairProcessor {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Process('apply-targeted')
  async handleApplyTargeted(job: Job<any>) {
    return this.workspacesService.processManuscriptRepairJob(job.data, job);
  }
}
