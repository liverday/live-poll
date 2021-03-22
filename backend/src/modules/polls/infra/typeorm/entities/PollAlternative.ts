import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Poll from './Poll';

@Entity('polls_alternatives')
class PollAlternative {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  color: string;

  @Column()
  seq: number;

  @ManyToOne(() => Poll, poll => poll.alternatives)
  @JoinColumn({ name: 'poll_id' })
  poll: Poll;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default PollAlternative;
