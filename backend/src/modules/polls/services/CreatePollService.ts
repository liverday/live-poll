import { injectable, inject } from 'tsyringe';
import { isBefore } from 'date-fns';

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
    ends_at,
  }: ICreatePollDTO): Promise<Poll> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    if (alternatives.length === 0) {
      throw new AppError('Should have one or more alternatives');
    }

    if (isBefore(ends_at, new Date())) {
      throw new AppError('Should ends after current date');
    }

    const poll = await this.pollsRepository.create({
      user_id,
      title,
      description,
      alternatives: alternatives.map((alternative, index) => ({
        ...alternative,
        seq: index + 1,
      })),
      ends_at,
    });

    await this.pollsRepository.save(poll);

    return poll;
  }
}

export default CreatePollService;
