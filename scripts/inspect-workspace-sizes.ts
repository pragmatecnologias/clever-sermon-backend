import { config } from 'dotenv';
import typeormDataSource from '../src/config/typeorm.config';

config();

type Row = Record<string, any>;

const workspaceId = process.env.WORKSPACE_ID || '0ceaeb20-a88c-42ba-85c9-ad182d76865d';

async function main() {
  await typeormDataSource.initialize();

  const tableNames = [
    'sermon_outlines',
    'sermon_manuscripts',
    'sermon_applications',
    'sermon_illustrations',
    'discussion_questions',
    'sermon_citations',
    'sermon_dna_analyses',
    'sermon_study_reports',
    'notes',
    'ai_conversations',
    'theological_center_analyses',
    'tension_analyses',
    'doctrinal_precision_checks',
    'blind_spot_analyses',
    'preaching_strategies',
    'historical_contexts_enhanced',
  ];
  const existingTables = await typeormDataSource.query(
    `select tablename from pg_tables where schemaname = 'public' and tablename = any($1::text[])`,
    [tableNames],
  );
  const existing = new Set((existingTables as Row[]).map((row) => row.tablename));
  const countColumns = tableNames
    .filter((name) => existing.has(name))
    .map((name) => `(select count(*) from ${name} where "workspaceId" = $1) as ${name}`);

  const counts = countColumns.length
    ? await typeormDataSource.query(`select ${countColumns.join(',\n        ')}`, [workspaceId])
    : [{}];

  const sizes = await typeormDataSource.query(
    `
      select
        pg_column_size(metadata) as metadata_bytes,
        pg_column_size("scriptureCache") as scripture_cache_bytes,
        pg_column_size("references") as references_bytes,
        pg_column_size("sermonCore") as sermon_core_bytes
      from sermon_workspaces
      where id = $1
    `,
    [workspaceId],
  );

  const relationSizes = await typeormDataSource.query(
    `
      select
        'sermon_outlines' as table_name,
        count(*) as rows,
        coalesce(sum(pg_column_size(structure)), 0) as json_bytes,
        coalesce(sum(length(coalesce(title, ''))), 0) as text_bytes
      from sermon_outlines
      where "workspaceId" = $1
      union all
      select
        'sermon_manuscripts',
        count(*) as rows,
        coalesce(sum(pg_column_size(content)), 0) as json_bytes,
        coalesce(sum(length(coalesce(content::text, ''))), 0) as text_bytes
      from sermon_manuscripts
      where "workspaceId" = $1
      union all
      select
        'sermon_study_reports',
        count(*) as rows,
        coalesce(sum(pg_column_size(sections)), 0) as json_bytes,
        coalesce(sum(length(coalesce("rawResponse", ''))), 0) as text_bytes
      from sermon_study_reports
      where "workspaceId" = $1
      union all
      select
        'sermon_citations',
        count(*) as rows,
        coalesce(sum(pg_column_size(row_to_json(s))), 0) as json_bytes,
        0 as text_bytes
      from sermon_citations s
      where "workspaceId" = $1
      union all
      select
        'sermon_applications',
        count(*) as rows,
        coalesce(sum(pg_column_size(row_to_json(s))), 0) as json_bytes,
        0 as text_bytes
      from sermon_applications s
      where "workspaceId" = $1
      union all
      select
        'discussion_questions',
        count(*) as rows,
        coalesce(sum(pg_column_size(row_to_json(s))), 0) as json_bytes,
        0 as text_bytes
      from discussion_questions s
      where "workspaceId" = $1
      union all
      select
        'sermon_illustrations',
        count(*) as rows,
        coalesce(sum(pg_column_size(row_to_json(s))), 0) as json_bytes,
        0 as text_bytes
      from sermon_illustrations s
      where "workspaceId" = $1
      union all
      select
        'sermon_dna_analyses',
        count(*) as rows,
        coalesce(sum(pg_column_size(row_to_json(s))), 0) as json_bytes,
        0 as text_bytes
      from sermon_dna_analyses s
      where "workspaceId" = $1
      union all
      select
        'historical_contexts_enhanced',
        count(*) as rows,
        coalesce(sum(pg_column_size(row_to_json(s))), 0) as json_bytes,
        0 as text_bytes
      from historical_contexts_enhanced s
      where "workspaceId" = $1
    `,
    [workspaceId],
  );

  console.log(JSON.stringify({ workspaceId, counts: counts[0] || counts, sizes: sizes[0] || sizes, relationSizes }, null, 2));

  await typeormDataSource.destroy();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
