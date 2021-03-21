import { getRepository, Repository } from 'typeorm';

import IPollsVotesRepository from '@modules/polls/repositories/IPollsVotesRepository';
import ICreatePollVoteDTO from '@modules/polls/dtos/ICreatePollVoteDTO';
import IFindPollsVotesResultDTO from '@modules/polls/dtos/IFindPollsVotesResultDTO';
import IFindUniquePollVoteDTO from '@modules/polls/dtos/IFindUniquePollVoteDTO';
import PollVote from '../entities/PollVote';

class PollsVotesRepository implements IPollsVotesRepository {
  private ormRepository: Repository<PollVote>;

  constructor() {
    this.ormRepository = getRepository(PollVote);
  }

  public async create(data: ICreatePollVoteDTO): Promise<PollVote> {
    return this.ormRepository.create(data);
  }

  public async save(data: PollVote): Promise<PollVote> {
    return this.ormRepository.save(data);
  }

  public async findPollResultById(
    poll_id: string,
  ): Promise<IFindPollsVotesResultDTO | undefined> {
    const entries = await this.ormRepository
      .createQueryBuilder()
      .select('poll_alternative_id')
      .addSelect('COUNT(*)', 'votes')
      .where('poll_id = :poll_id', { poll_id })
      .groupBy('poll_alternative_id')
      .getRawMany();

    const initial: IFindPollsVotesResultDTO = {
      items: [],
      total: 0,
    };

    return entries.reduce(
      (accumulator, current) => {
        accumulator.items.push({ ...current });
        accumulator.total += current.votes;

        return accumulator;
      },
      { ...initial },
    );
  }

  public async findUniquePollVote({
    poll_id,
    ip,
    user_agent,
  }: IFindUniquePollVoteDTO): Promise<PollVote | undefined> {
    return this.ormRepository.findOne({
      where: {
        poll_id,
        ip,
        user_agent,
      },
    });
  }
}

export default PollsVotesRepository;
