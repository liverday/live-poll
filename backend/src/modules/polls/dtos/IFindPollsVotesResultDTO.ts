interface IFindPollVoteResultItem {
  poll_alternative_id: string;
  votes: number;
}

export default interface IFindPollVotesResultDTO {
  items: IFindPollVoteResultItem[];
  total: number;
}
