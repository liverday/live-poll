import AppError from '@shared/errors/AppError';

import FakePollsRepository from '@modules/polls/repositories/fakes/FakePollsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FindPollService from './FindPollService';

let fakeUsersRepository: FakeUsersRepository;
let findPollService: FindPollService;
let fakePollsRepository: FakePollsRepository;

describe('FindPollService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePollsRepository = new FakePollsRepository();
    findPollService = new FindPollService(fakePollsRepository);
  });

  it('should be able to get a poll', async () => {
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

    const { id: poll_id } = await fakePollsRepository.create({
      user_id: user.id,
      title: 'Minha votação',
      description: 'Essa votação é demais',
      alternatives,
      ends_at: new Date(),
    });

    const poll = await findPollService.execute({
      poll_id,
    });

    expect(poll.id).toBe(poll_id);
  });

  it('should not be able to get a poll that dont exists', async () => {
    await expect(
      findPollService.execute({
        poll_id: 'teste',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
