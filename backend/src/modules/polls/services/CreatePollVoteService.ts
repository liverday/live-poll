import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import ICreatePollVoteDTO from '../dtos/ICreatePollVoteDTO';
import PollVote from '../infra/typeorm/entities/PollVote';
import IPollsVotesRepository from '../repositories/IPollsVotesRepository';
import IPollsRepository from '../repositories/IPollsRepository';

@injectable()
class CreatePollVoteService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PollsRepository')
    private pollsRepository: IPollsRepository,

    @inject('PollsVotesRepository')
    private pollsVotesRepository: IPollsVotesRepository,
  ) {}

  public async execute({
    user_id,
    poll_id,
    poll_alternative_id,
    ip,
    user_agent,
  }: ICreatePollVoteDTO): Promise<PollVote> {
    const poll = await this.pollsRepository.findPollById(poll_id);

    if (!poll) {
      throw new AppError('Poll not found');
    }

    const alternativeFound = poll.alternatives.find(
      alternative => alternative.id === poll_alternative_id,
    );

    if (!alternativeFound) {
      throw new AppError('Invalid alternative');
    }

    const checkAlreadyVoted = await this.pollsVotesRepository.findUniquePollVote(
      {
        poll_id,
        ip,
        user_agent,
      },
    );

    if (checkAlreadyVoted) {
      throw new AppError('Already Voted');
    }

    let user: User | undefined;

    if (user_id) {
      user = await this.usersRepository.findById(user_id);
    }

    const pollVote = await this.pollsVotesRepository.create({
      user_id: user?.id,
      poll_id,
      poll_alternative_id,
      ip,
      user_agent,
    });

    return pollVote;
  }
}

export default CreatePollVoteService;
