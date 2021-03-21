import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import { v4 as uuid } from 'uuid';
import IUsersRepository from '../IUsersRepository';

export default class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid() }, { ...data });

    this.users.push(user);

    return user;
  }

  public async save(data: User): Promise<User> {
    const userIndex = this.users.findIndex(user => user.id === data.id);

    if (userIndex >= 0) {
      this.users[userIndex] = data;
    }

    return data;
  }
}
