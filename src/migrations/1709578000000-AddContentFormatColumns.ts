import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddContentFormatColumns1709578000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add contentFormat column to sermon_outlines
    const outlinesTable = await queryRunner.getTable('sermon_outlines');
    if (outlinesTable && !outlinesTable.findColumnByName('contentFormat')) {
      await queryRunner.addColumn(
        'sermon_outlines',
        new TableColumn({
          name: 'contentFormat',
          type: 'varchar',
          length: '20',
          default: "'markdown'",
        })
      );
    }

    // Add contentFormat column to sermon_manuscripts
    const manuscriptsTable = await queryRunner.getTable('sermon_manuscripts');
    if (manuscriptsTable && !manuscriptsTable.findColumnByName('contentFormat')) {
      await queryRunner.addColumn(
        'sermon_manuscripts',
        new TableColumn({
          name: 'contentFormat',
          type: 'varchar',
          length: '20',
          default: "'markdown'",
        })
      );
    }

    // Add contentFormat column to sermon_applications
    const applicationsTable = await queryRunner.getTable('sermon_applications');
    if (applicationsTable && !applicationsTable.findColumnByName('contentFormat')) {
      await queryRunner.addColumn(
        'sermon_applications',
        new TableColumn({
          name: 'contentFormat',
          type: 'varchar',
          length: '20',
          default: "'markdown'",
        })
      );
    }

    // Add contentFormat column to sermon_illustrations
    const illustrationsTable = await queryRunner.getTable('sermon_illustrations');
    if (illustrationsTable && !illustrationsTable.findColumnByName('contentFormat')) {
      await queryRunner.addColumn(
        'sermon_illustrations',
        new TableColumn({
          name: 'contentFormat',
          type: 'varchar',
          length: '20',
          default: "'markdown'",
        })
      );
    }

    // Add contentFormat column to discussion_questions
    const questionsTable = await queryRunner.getTable('discussion_questions');
    if (questionsTable && !questionsTable.findColumnByName('contentFormat')) {
      await queryRunner.addColumn(
        'discussion_questions',
        new TableColumn({
          name: 'contentFormat',
          type: 'varchar',
          length: '20',
          default: "'markdown'",
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove contentFormat columns in reverse order
    const questionsTable = await queryRunner.getTable('discussion_questions');
    if (questionsTable && questionsTable.findColumnByName('contentFormat')) {
      await queryRunner.dropColumn('discussion_questions', 'contentFormat');
    }

    const illustrationsTable = await queryRunner.getTable('sermon_illustrations');
    if (illustrationsTable && illustrationsTable.findColumnByName('contentFormat')) {
      await queryRunner.dropColumn('sermon_illustrations', 'contentFormat');
    }

    const applicationsTable = await queryRunner.getTable('sermon_applications');
    if (applicationsTable && applicationsTable.findColumnByName('contentFormat')) {
      await queryRunner.dropColumn('sermon_applications', 'contentFormat');
    }

    const manuscriptsTable = await queryRunner.getTable('sermon_manuscripts');
    if (manuscriptsTable && manuscriptsTable.findColumnByName('contentFormat')) {
      await queryRunner.dropColumn('sermon_manuscripts', 'contentFormat');
    }

    const outlinesTable = await queryRunner.getTable('sermon_outlines');
    if (outlinesTable && outlinesTable.findColumnByName('contentFormat')) {
      await queryRunner.dropColumn('sermon_outlines', 'contentFormat');
    }
  }
}
