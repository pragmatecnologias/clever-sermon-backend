import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import typeormDataSource from '../config/typeorm.config';
import { CreateEGWTables1709577500000 } from '../migrations/1709577500000-CreateEGWTables';
import { CreateEGWScriptureReferences1709577600000 } from '../migrations/1709577600000-CreateEGWScriptureReferences';
import { seed } from './seed';

config();

const run = async () => {
  const sqlPath = path.join(__dirname, '../../schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  await typeormDataSource.initialize();
  const queryRunner = typeormDataSource.createQueryRunner();
  try {
    await typeormDataSource.query(sql);
    await queryRunner.connect();
    await new CreateEGWTables1709577500000().up(queryRunner);
    await new CreateEGWScriptureReferences1709577600000().up(queryRunner);
    await seed();
    console.log('Schema creation complete.');
  } finally {
    await queryRunner.release().catch(() => undefined);
    await typeormDataSource.destroy();
  }
};

run().catch((error) => {
  console.error('Schema creation failed:', error);
  process.exit(1);
});
