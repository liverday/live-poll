import { v4 as uuid } from 'uuid';

import ICreatePollDTO from '@modules/polls/dtos/ICreatePollDTO';
import Poll from '@modules/polls/infra/typeorm/entities/Poll';
import IPollsRepository from '../IPollsRepository';

class FakePollsRepository implements IPollsRepository {
  private polls: Poll[] = [];

  public async findPollById(id: string): Promise<Poll | undefined> {
    return this.polls.find(poll => poll.id === id);
  }

  public async create(data: ICreatePollDTO): Promise<Poll> {
    const poll = new Poll();

    Object.assign(poll, { id: uuid() }, { ...data });

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
}

export default FakePollsRepository;
