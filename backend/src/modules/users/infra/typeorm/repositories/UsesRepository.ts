import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { Repository, getRepository } from 'typeorm';

import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.ormRepository.findOne({ where: { email } });
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.ormRepository.findOne(id);
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    return this.ormRepository.create(data);
  }

  public async save(data: User): Promise<User> {
    return this.ormRepository.save(data);
  }
}

export default UsersRepository;
