export default interface IPollVote {
  poll_id: string;
  poll_alternative_id: string;
  ip: string;
  user_agent: string;
  user_id?: string;
}
