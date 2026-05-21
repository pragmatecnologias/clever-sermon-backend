import { config } from 'dotenv';
import typeormDataSource from '../src/config/typeorm.config';
import { SermonWorkspace } from '../src/entities/sermon-workspace.entity';

config();

const workspaceId = process.env.WORKSPACE_ID || '0ceaeb20-a88c-42ba-85c9-ad182d76865d';
const relations = (process.env.RELATIONS || 'outlines,manuscripts,applications,illustrations,discussionQuestions,citations,dnaAnalyses,studyReports')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

async function main() {
  await typeormDataSource.initialize();
  const workspace = await typeormDataSource.getRepository(SermonWorkspace).findOne({
    where: { id: workspaceId },
    relations,
  });

  if (!workspace) {
    console.log(JSON.stringify({ workspaceId, found: false }));
    await typeormDataSource.destroy();
    return;
  }

  console.log(JSON.stringify({
    workspaceId,
    relations,
    found: true,
    counts: {
      outlines: workspace.outlines?.length || 0,
      manuscripts: workspace.manuscripts?.length || 0,
      applications: workspace.applications?.length || 0,
      illustrations: workspace.illustrations?.length || 0,
      discussionQuestions: workspace.discussionQuestions?.length || 0,
      citations: workspace.citations?.length || 0,
      dnaAnalyses: workspace.dnaAnalyses?.length || 0,
      studyReports: workspace.studyReports?.length || 0,
    },
    hasWorkspaceBackrefs: Boolean(
      workspace.outlines?.some((item: any) => Boolean(item?.workspace)) ||
      workspace.manuscripts?.some((item: any) => Boolean(item?.workspace)) ||
      workspace.studyReports?.some((item: any) => Boolean(item?.workspace))
    ),
  }, null, 2));

  await typeormDataSource.destroy();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
