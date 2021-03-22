import { Repository, getRepository } from 'typeorm';

import IPollsRepository from '@modules/polls/repositories/IPollsRepository';
import ICreatePollDTO from '@modules/polls/dtos/ICreatePollDTO';
import Poll from '../entities/Poll';

class PollsRepository implements IPollsRepository {
  private ormRepository: Repository<Poll>;

  constructor() {
    this.ormRepository = getRepository(Poll);
  }

  public async findPollById(id: string): Promise<Poll | undefined> {
    return this.ormRepository
      .createQueryBuilder('polls')
      .leftJoinAndSelect('polls.alternatives', 'alternatives')
      .where('polls.id = :poll_id', { poll_id: id })
      .orderBy('alternatives.seq', 'ASC')
      .getOne();
  }

  public async create(data: ICreatePollDTO): Promise<Poll> {
    return this.ormRepository.create(data);
  }

  public async save(data: Poll): Promise<Poll> {
    return this.ormRepository.save(data);
  }

  public async findAllUserPolls(user_id: string): Promise<Poll[]> {
    return this.ormRepository.find({ where: { user_id } });
  }
}

export default PollsRepository;
