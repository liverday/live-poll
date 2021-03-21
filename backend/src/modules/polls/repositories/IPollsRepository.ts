import ICreatePollDTO from '../dtos/ICreatePollDTO';
import Poll from '../infra/typeorm/entities/Poll';

export default interface IPollsRepository {
  findPollById(id: string): Promise<Poll | undefined>;
  create(data: ICreatePollDTO): Promise<Poll>;
  save(data: Poll): Promise<Poll>;
}
