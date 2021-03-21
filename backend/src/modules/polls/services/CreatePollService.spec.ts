import AppError from '@shared/errors/AppError';

import FakePollsRepository from '@modules/polls/repositories/fakes/FakePollsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreatePollService from './CreatePollService';

let createPollService: CreatePollService;
let fakePollsRepository: FakePollsRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('CreatePollService', () => {
  beforeEach(() => {
    fakePollsRepository = new FakePollsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    createPollService = new CreatePollService(
      fakePollsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to create a poll', async () => {
    const user = await fakeUsersRepository.create({
      name: 'john doe',
      email: 'john@doe.com',
      password: '123123',
    });

    const alternatives = [
      {
        title: 'Opção 1',
        color: '#fff',
      },
      {
        title: 'Opção 2',
        color: '#f0fea0',
      },
    ];

    const poll = await createPollService.execute({
      user_id: user.id,
      title: 'Minha votação',
      description: 'Essa votação é demais',
      alternatives,
    });

    expect(poll.alternatives).toEqual(expect.arrayContaining(alternatives));
  });

  it('should not be able to create a poll with inexistent user', async () => {
    const alternatives = [
      {
        title: 'Opção 1',
        color: '#fff',
      },
      {
        title: 'Opção 2',
        color: '#f0fea0',
      },
    ];

    await expect(
      createPollService.execute({
        user_id: 'teste',
        title: 'Minha votação',
        description: 'Essa votação é demais',
        alternatives,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a poll with empty alternatives', async () => {
    const user = await fakeUsersRepository.create({
      name: 'john doe',
      email: 'john@doe.com',
      password: '123123',
    });

    await expect(
      createPollService.execute({
        user_id: user.id,
        title: 'Minha votação',
        description: 'Essa votação é demais',
        alternatives: [],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
