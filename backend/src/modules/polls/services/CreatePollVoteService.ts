import { injectable, inject } from 'tsyringe';
import { isBefore } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IWebSocketProvider from '@shared/container/providers/WebSocketProvider/models/IWebSocketProvider';

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

    @inject('WebSocketProvider')
    private webSocketProvider: IWebSocketProvider,
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

    if (isBefore(poll.ends_at, new Date())) {
      throw new AppError('Poll Expired');
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

    await this.pollsVotesRepository.save(pollVote);

    const connections = this.webSocketProvider.findConnections(poll_id);

    this.webSocketProvider.sendMessage(connections, 'NEW_VOTE', {
      poll_alternative_id,
    });

    return pollVote;
  }
}

export default CreatePollVoteService;
