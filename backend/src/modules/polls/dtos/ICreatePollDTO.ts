interface IPollAlternative {
  title: string;
  color: string;
}

export default interface ICreatePollDTO {
  user_id: string;
  title: string;
  description: string;
  alternatives: IPollAlternative[];
  ends_at: Date;
}
