import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddContentFormatToReportsAndDna1709578100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add contentFormat column to sermon_study_reports
    const reportsTable = await queryRunner.getTable('sermon_study_reports');
    if (reportsTable && !reportsTable.findColumnByName('contentFormat')) {
      await queryRunner.addColumn(
        'sermon_study_reports',
        new TableColumn({
          name: 'contentFormat',
          type: 'varchar',
          length: '20',
          default: "'markdown'",
        })
      );
    }

    // Add contentFormat column to sermon_dna_analyses
    const dnaTable = await queryRunner.getTable('sermon_dna_analyses');
    if (dnaTable && !dnaTable.findColumnByName('contentFormat')) {
      await queryRunner.addColumn(
        'sermon_dna_analyses',
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
    const dnaTable = await queryRunner.getTable('sermon_dna_analyses');
    if (dnaTable && dnaTable.findColumnByName('contentFormat')) {
      await queryRunner.dropColumn('sermon_dna_analyses', 'contentFormat');
    }

    const reportsTable = await queryRunner.getTable('sermon_study_reports');
    if (reportsTable && reportsTable.findColumnByName('contentFormat')) {
      await queryRunner.dropColumn('sermon_study_reports', 'contentFormat');
    }
  }
}
