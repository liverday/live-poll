import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPollsRepository from '../repositories/IPollsRepository';
import ICreatePollDTO from '../dtos/ICreatePollDTO';
import Poll from '../infra/typeorm/entities/Poll';

@injectable()
class CreatePollService {
  constructor(
    @inject('PollsRepository')
    private pollsRepository: IPollsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    title,
    description,
    alternatives,
  }: ICreatePollDTO): Promise<Poll> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    if (alternatives.length === 0) {
      throw new AppError('Should have one or more alternatives');
    }

    const poll = await this.pollsRepository.create({
      user_id,
      title,
      description,
      alternatives,
    });

    await this.pollsRepository.save(poll);

    return poll;
  }
}

export default CreatePollService;
