import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateEGWTables1709577500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension if not already enabled
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create egw_books table
    await queryRunner.createTable(
      new Table({
        name: 'egw_books',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'code',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'category',
            type: 'varchar',
          },
          {
            name: 'language',
            type: 'varchar',
            length: '2',
            default: "'en'",
          },
          {
            name: 'chapterCount',
            type: 'int',
            default: 0,
          },
          {
            name: 'paragraphCount',
            type: 'int',
            default: 0,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
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

    // Create indexes for egw_books
    await queryRunner.createIndex(
      'egw_books',
      new TableIndex({
        name: 'IDX_egw_books_code',
        columnNames: ['code'],
      })
    );

    await queryRunner.createIndex(
      'egw_books',
      new TableIndex({
        name: 'IDX_egw_books_language',
        columnNames: ['language'],
      })
    );

    // Create egw_paragraphs table
    await queryRunner.createTable(
      new Table({
        name: 'egw_paragraphs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'bookCode',
            type: 'varchar',
          },
          {
            name: 'bookTitle',
            type: 'varchar',
          },
          {
            name: 'language',
            type: 'varchar',
            length: '2',
            default: "'en'",
          },
          {
            name: 'chapterNumber',
            type: 'int',
          },
          {
            name: 'chapterTitle',
            type: 'varchar',
          },
          {
            name: 'paragraphNumber',
            type: 'int',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'reference',
            type: 'varchar',
            isUnique: true,
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

    // Create indexes for egw_paragraphs
    await queryRunner.createIndex(
      'egw_paragraphs',
      new TableIndex({
        name: 'IDX_egw_paragraphs_book_chapter_para',
        columnNames: ['bookCode', 'chapterNumber', 'paragraphNumber'],
      })
    );

    await queryRunner.createIndex(
      'egw_paragraphs',
      new TableIndex({
        name: 'IDX_egw_paragraphs_reference',
        columnNames: ['reference'],
      })
    );

    await queryRunner.createIndex(
      'egw_paragraphs',
      new TableIndex({
        name: 'IDX_egw_paragraphs_bookCode',
        columnNames: ['bookCode'],
      })
    );

    await queryRunner.createIndex(
      'egw_paragraphs',
      new TableIndex({
        name: 'IDX_egw_paragraphs_language',
        columnNames: ['language'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('egw_paragraphs');
    await queryRunner.dropTable('egw_books');
  }
}
