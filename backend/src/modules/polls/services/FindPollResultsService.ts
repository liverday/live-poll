import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IPollsVotesRepository from '../repositories/IPollsVotesRepository';
import IFindPollVotesResultDTO from '../dtos/IFindPollsVotesResultDTO';
import IPollsRepository from '../repositories/IPollsRepository';

interface IRequest {
  poll_id: string;
}

@injectable()
class FindPollResultsService {
  constructor(
    @inject('PollsRepository')
    private pollsRepository: IPollsRepository,

    @inject('PollsVotesRepository')
    private pollVotesRepository: IPollsVotesRepository,
  ) {}

  public async execute({
    poll_id,
  }: IRequest): Promise<IFindPollVotesResultDTO> {
    const poll = await this.pollsRepository.findPollById(poll_id);

    if (!poll) {
      throw new AppError('Poll not found');
    }

    const pollResults = await this.pollVotesRepository.findPollResultById(
      poll_id,
    );

    return pollResults;
  }
}

export default FindPollResultsService;
