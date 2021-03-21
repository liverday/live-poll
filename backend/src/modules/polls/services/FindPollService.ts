import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IPollsRepository from '../repositories/IPollsRepository';
import Poll from '../infra/typeorm/entities/Poll';

interface IRequest {
  poll_id: string;
}

@injectable()
class FindPollService {
  constructor(
    @inject('PollsRepository')
    private pollsRepository: IPollsRepository,
  ) {}

  public async execute({ poll_id }: IRequest): Promise<Poll> {
    const poll = await this.pollsRepository.findPollById(poll_id);

    if (!poll) {
      throw new AppError('Poll not found');
    }

    return poll;
  }
}

export default FindPollService;
