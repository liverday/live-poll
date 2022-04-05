import { v4 as uuid } from 'uuid';

import ICreatePollDTO from '@modules/polls/dtos/ICreatePollDTO';
import Poll from '@modules/polls/infra/typeorm/entities/Poll';
import IPollsRepository from '../IPollsRepository';
import IListUserPollsPageableDTO from '@modules/polls/dtos/IListUserPollsPageableDTO';

class FakePollsRepository implements IPollsRepository {
  private polls: Poll[] = [];

  public async findPollById(id: string): Promise<Poll | undefined> {
    return this.polls.find(poll => poll.id === id);
  }

  public async create({
    alternatives,
    ...data
  }: ICreatePollDTO): Promise<Poll> {
    const poll = new Poll();

    Object.assign(
      poll,
      { id: uuid() },
      {
        ...data,
        alternatives: alternatives.map(alternative => ({
          id: uuid(),
          ...alternative,
        })),
      },
    );

    this.polls.push(poll);

    return poll;
  }

  public async save(data: Poll): Promise<Poll> {
    const pollIndex = this.polls.findIndex(poll => poll.id === data.id);

    if (pollIndex >= 0) {
      this.polls[pollIndex] = data;
    }

    return data;
  }

  public async findAllUserPolls({ user_id, page, size }: IListUserPollsPageableDTO): Promise<Poll[]> {
    return this.polls.filter(poll => poll.user_id === user_id).filter((_, index) => index >= (page - 1) * size && index < page * size);
  }
}

export default FakePollsRepository;
