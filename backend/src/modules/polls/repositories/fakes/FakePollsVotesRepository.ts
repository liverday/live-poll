/* eslint-disable no-param-reassign */
import { v4 as uuid } from 'uuid';

import ICreatePollVoteDTO from '@modules/polls/dtos/ICreatePollVoteDTO';
import IFindPollVotesResultDTO from '@modules/polls/dtos/IFindPollsVotesResultDTO';
import PollVote from '@modules/polls/infra/typeorm/entities/PollVote';
import IFindUniquePollVoteDTO from '@modules/polls/dtos/IFindUniquePollVoteDTO';
import IPollsVotesRepository from '../IPollsVotesRepository';

class FakePollsVotesRepository implements IPollsVotesRepository {
  private pollsVotes: PollVote[] = [];

  public async create(data: ICreatePollVoteDTO): Promise<PollVote> {
    const pollVote = new PollVote();

    Object.assign(pollVote, { id: uuid() }, { ...data });

    this.pollsVotes.push(pollVote);

    return pollVote;
  }

  public async save(data: PollVote): Promise<PollVote> {
    const pollVoteIndex = this.pollsVotes.findIndex(
      pollVote => pollVote.id === data.id,
    );

    if (pollVoteIndex >= 0) {
      this.pollsVotes[pollVoteIndex] = data;
    }

    return data;
  }

  public async findPollResultById(
    poll_id: string,
  ): Promise<IFindPollVotesResultDTO | undefined> {
    const pollVotes = this.pollsVotes.filter(
      pollVote => pollVote.poll_id === poll_id,
    );

    if (pollVotes.length === 0) return undefined;

    const initial: IFindPollVotesResultDTO = {
      items: [],
      total: 0,
    };

    const result = this.pollsVotes.reduce(
      (accumulator, current, _) => {
        const foundIndex = accumulator.items.findIndex(
          item => item.poll_alternative_id === current.poll_alternative_id,
        );

        if (foundIndex === 0) {
          accumulator.items.push({
            poll_alternative_id: current.alternative.id,
            votes: 1,
          });
        } else {
          accumulator.items[foundIndex].votes += 1;
        }

        accumulator.total += 1;
        return accumulator;
      },
      {
        ...initial,
      },
    );

    return result;
  }

  public async findUniquePollVote({
    poll_id,
    ip,
    user_agent,
  }: IFindUniquePollVoteDTO): Promise<PollVote | undefined> {
    return this.pollsVotes.find(
      pollVote =>
        pollVote.poll_id === poll_id &&
        pollVote.ip === ip &&
        pollVote.user_agent === user_agent,
    );
  }
}

export default FakePollsVotesRepository;
