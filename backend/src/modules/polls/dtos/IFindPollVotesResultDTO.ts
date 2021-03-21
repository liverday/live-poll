import PollAlternative from '../infra/typeorm/entities/PollAlternative';

interface IFindPollVoteResultItem {
  alternative: PollAlternative;
  votes: number;
}

export default interface IFindPollVotesResultDTO {
  items: IFindPollVoteResultItem[];
  total: number;
}
