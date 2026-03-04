import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateEGWScriptureReferences1709577600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension if not already enabled
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create egw_scripture_references table
    await queryRunner.createTable(
      new Table({
        name: 'egw_scripture_references',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'egwParagraphId',
            type: 'uuid',
          },
          {
            name: 'book',
            type: 'varchar',
          },
          {
            name: 'chapter',
            type: 'int',
          },
          {
            name: 'verseStart',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'verseEnd',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'reference',
            type: 'varchar',
          },
          {
            name: 'language',
            type: 'varchar',
            length: '2',
            default: "'en'",
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true
    );

    // Create indexes
    await queryRunner.createIndex(
      'egw_scripture_references',
      new TableIndex({
        name: 'IDX_egw_scripture_ref_book_chapter_verse',
        columnNames: ['book', 'chapter', 'verseStart'],
      })
    );

    await queryRunner.createIndex(
      'egw_scripture_references',
      new TableIndex({
        name: 'IDX_egw_scripture_ref_paragraph',
        columnNames: ['egwParagraphId'],
      })
    );

    await queryRunner.createIndex(
      'egw_scripture_references',
      new TableIndex({
        name: 'IDX_egw_scripture_ref_reference',
        columnNames: ['reference'],
      })
    );

    await queryRunner.createIndex(
      'egw_scripture_references',
      new TableIndex({
        name: 'IDX_egw_scripture_ref_language',
        columnNames: ['language'],
      })
    );

    // Create foreign key to egw_paragraphs
    await queryRunner.createForeignKey(
      'egw_scripture_references',
      new TableForeignKey({
        columnNames: ['egwParagraphId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'egw_paragraphs',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('egw_scripture_references');
  }
}
