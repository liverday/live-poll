import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let createUserService: CreateUserService;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create an user', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should be able to reject a registration with already registrated email', async () => {
    await createUserService.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    await expect(
      createUserService.execute({
        name: 'Liam Doe',
        email: 'john@doe.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
