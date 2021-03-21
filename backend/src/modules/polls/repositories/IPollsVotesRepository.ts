import ICreatePollVoteDTO from '../dtos/ICreatePollVoteDTO';

import IFindPollVotesResultDTO from '../dtos/IFindPollVotesResultDTO';
import IFindUniquePollVoteDTO from '../dtos/IFindUniquePollVoteDTO';

import PollVote from '../infra/typeorm/entities/PollVote';

export default interface IPollVotesRepository {
  create(data: ICreatePollVoteDTO): Promise<PollVote>;
  findPollResultById(
    poll_id: string,
  ): Promise<IFindPollVotesResultDTO | undefined>;
  findUniquePollVote(
    data: IFindUniquePollVoteDTO,
  ): Promise<PollVote | undefined>;
}
