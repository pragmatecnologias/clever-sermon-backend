import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

config({ path: path.join(__dirname, '../.env') });

const databaseUrl = process.env.DATABASE_URL || 'postgresql://admin:secret123@localhost:5432/';
const databaseName = process.env.DATABASE_NAME || 'clever_sermon';

const urlMatch = databaseUrl.match(/postgresql?:\/\/([^:]+):([^@]+)@([^:\/]+):(\d+)/);
if (!urlMatch) {
  throw new Error('Invalid DATABASE_URL format');
}

const [, username, password, host, port] = urlMatch;

const dataSource = new DataSource({
  type: 'postgres',
  host,
  port: parseInt(port),
  username,
  password,
  database: databaseName,
  synchronize: false,
  logging: false,
});

async function clearSpanishEGW() {
  try {
    await dataSource.initialize();
    console.log('🗑️  Clearing Spanish EGW data...\n');

    await dataSource.query("DELETE FROM egw_scripture_references WHERE language = 'es'");
    console.log('✅ Cleared Spanish scripture references');

    await dataSource.query("DELETE FROM egw_paragraphs WHERE language = 'es'");
    console.log('✅ Cleared Spanish paragraphs');

    await dataSource.query("DELETE FROM egw_books WHERE language = 'es'");
    console.log('✅ Cleared Spanish books');

    await dataSource.destroy();
    console.log('\n✅ Spanish EGW data cleared successfully');
  } catch (error) {
    console.error('❌ Error:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

clearSpanishEGW();
