import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreatePollVotes1616291932463
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'polls_votes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'poll_id',
            type: 'uuid',
          },
          {
            name: 'poll_alternative_id',
            type: 'uuid',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'ip',
            type: 'varchar',
          },
          {
            name: 'user_agent',
            type: 'varchar',
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('polls_votes', [
      new TableForeignKey({
        name: 'PollVotesPoll',
        columnNames: ['poll_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'polls',
      }),
      new TableForeignKey({
        name: 'PollVotesPollAlternative',
        columnNames: ['poll_alternative_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'polls_alternatives',
      }),
      new TableForeignKey({
        name: 'PollVotesUser',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('polls_votes', 'PollVotesPoll');
    await queryRunner.dropForeignKey('polls_votes', 'PollVotesPollAlternative');
    await queryRunner.dropForeignKey('polls_votes', 'PollVotesUser');
    await queryRunner.dropTable('polls_votes');
  }
}
