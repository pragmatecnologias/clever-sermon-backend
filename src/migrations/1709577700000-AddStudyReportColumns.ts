import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStudyReportColumns1709577700000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if columns exist before adding
    const table = await queryRunner.getTable('sermon_study_reports');
    
    if (table && !table.findColumnByName('generatedBy')) {
      await queryRunner.addColumn(
        'sermon_study_reports',
        new TableColumn({
          name: 'generatedBy',
          type: 'varchar',
          isNullable: true,
        })
      );
    }
    
    if (table && !table.findColumnByName('generatedModel')) {
      await queryRunner.addColumn(
        'sermon_study_reports',
        new TableColumn({
          name: 'generatedModel',
          type: 'text',
          isNullable: true,
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('sermon_study_reports');
    
    if (table && table.findColumnByName('generatedModel')) {
      await queryRunner.dropColumn('sermon_study_reports', 'generatedModel');
    }
    
    if (table && table.findColumnByName('generatedBy')) {
      await queryRunner.dropColumn('sermon_study_reports', 'generatedBy');
    }
  }
}
