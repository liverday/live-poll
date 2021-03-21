/* eslint-disable no-param-reassign */
import { v4 as uuid } from 'uuid';

import ICreatePollVoteDTO from '@modules/polls/dtos/ICreatePollVoteDTO';
import IFindPollVotesResultDTO from '@modules/polls/dtos/IFindPollVotesResultDTO';
import PollVote from '@modules/polls/infra/typeorm/entities/PollVote';
import IFindUniquePollVoteDTO from '@modules/polls/dtos/IFindUniquePollVoteDTO';
import IPollVotesRepository from '../IPollsVotesRepository';

class FakePollVotesRepository implements IPollVotesRepository {
  private pollsVotes: PollVote[] = [];

  public async create(data: ICreatePollVoteDTO): Promise<PollVote> {
    const pollVote = new PollVote();

    Object.assign(pollVote, { id: uuid() }, { ...data });

    this.pollsVotes.push(pollVote);

    return pollVote;
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
      (current, accumulator, _) => {
        const foundIndex = current.items.findIndex(
          item => item.alternative.id === accumulator.poll_alternative_id,
        );

        if (foundIndex === 0) {
          current.items.push({
            alternative: accumulator.alternative,
            votes: 1,
          });
        } else {
          current.items[foundIndex].votes += 1;
        }

        current.total += 1;
        return current;
      },
      {
        ...initial,
      },
    );

    return result;
  }

  public async findUniquePollVote({
    ip,
    user_agent,
  }: IFindUniquePollVoteDTO): Promise<PollVote | undefined> {
    return this.pollsVotes.find(
      pollVote => pollVote.ip === ip && pollVote.user_agent === user_agent,
    );
  }
}

export default FakePollVotesRepository;
