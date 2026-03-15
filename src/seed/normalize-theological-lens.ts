import { config } from 'dotenv';
import typeormDataSource from '../config/typeorm.config';

config();

const run = async () => {
  await typeormDataSource.initialize();
  try {
    const countResult = await typeormDataSource.query(
      `SELECT COUNT(*)::int AS count
       FROM sermon_workspaces
       WHERE COALESCE(TRIM("theologicalLens"), '') <> 'adventist'`,
    );

    const affectedBefore = Number(countResult?.[0]?.count || 0);

    await typeormDataSource.query(
      `UPDATE sermon_workspaces
       SET "theologicalLens" = 'adventist'
       WHERE COALESCE(TRIM("theologicalLens"), '') <> 'adventist'`,
    );

    console.log(
      `Theological lens normalization complete. Updated ${affectedBefore} workspace(s) to 'adventist'.`,
    );
  } finally {
    await typeormDataSource.destroy();
  }
};

run().catch((error) => {
  console.error('Theological lens normalization failed:', error);
  process.exit(1);
});
