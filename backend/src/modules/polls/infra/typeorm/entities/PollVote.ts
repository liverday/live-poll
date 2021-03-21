import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import PollAlternative from './PollAlternative';

@Entity('polls_votes')
class PollVote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  poll_id: string;

  @Column()
  poll_alternative_id: string;

  @OneToOne(() => PollAlternative)
  @JoinColumn({ name: 'poll_alternative_id' })
  alternative: PollAlternative;

  @Column()
  ip: string;

  @Column()
  user_agent: string;

  @Column()
  user_id?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default PollVote;
