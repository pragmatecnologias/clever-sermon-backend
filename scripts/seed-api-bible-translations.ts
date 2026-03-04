import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  database: 'clever_sermon',
  entities: ['src/entities/**/*.entity.ts'],
  synchronize: false,
});

async function seedApiBibleTranslations() {
  await AppDataSource.initialize();

  const translations = [
    {
      code: 'NKJV',
      name: 'New King James Version',
      language: 'en',
      apiId: '63097d2a0a2f7db3-01',
      isPublicDomain: false,
    },
    {
      code: 'NBLA',
      name: 'Nueva Biblia de las Américas',
      language: 'es',
      apiId: 'ce11b813f9a27e20-01',
      isPublicDomain: false,
    },
  ];

  const repo = AppDataSource.getRepository('BibleTranslation');

  for (const translation of translations) {
    const existing = await repo.findOne({ where: { code: translation.code } });
    
    if (existing) {
      await repo.update({ code: translation.code }, translation);
      console.log(`✓ Updated ${translation.code}`);
    } else {
      await repo.insert(translation);
      console.log(`✓ Inserted ${translation.code}`);
    }
  }

  console.log('\n✅ API.Bible translations seeded successfully!');
  await AppDataSource.destroy();
}

seedApiBibleTranslations().catch((error) => {
  console.error('❌ Error seeding translations:', error);
  process.exit(1);
});
