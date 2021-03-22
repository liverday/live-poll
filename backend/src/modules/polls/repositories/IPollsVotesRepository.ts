import ICreatePollVoteDTO from '../dtos/ICreatePollVoteDTO';

import IFindPollsVotesResultDTO from '../dtos/IFindPollsVotesResultDTO';
import IFindUniquePollVoteDTO from '../dtos/IFindUniquePollVoteDTO';

import PollVote from '../infra/typeorm/entities/PollVote';

export default interface IPollsVotesRepository {
  create(data: ICreatePollVoteDTO): Promise<PollVote>;
  save(data: PollVote): Promise<PollVote>;
  findPollResultById(poll_id: string): Promise<IFindPollsVotesResultDTO>;
  findUniquePollVote(
    data: IFindUniquePollVoteDTO,
  ): Promise<PollVote | undefined>;
}
