import { injectable, inject } from 'tsyringe';

import Poll from '@modules/polls/infra/typeorm/entities/Poll';
import IPollsRepository from '../repositories/IPollsRepository';

interface IRequest {
  user_id: string;
}

@injectable()
class ListUserPollsService {
  constructor(
    @inject('PollsRepository')
    private pollsRepository: IPollsRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<Poll[]> {
    return this.pollsRepository.findAllUserPolls(user_id);
  }
}

export default ListUserPollsService;
