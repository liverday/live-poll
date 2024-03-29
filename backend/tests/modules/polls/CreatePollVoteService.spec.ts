import { addDays, subDays } from 'date-fns';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeWebSocketProvider from '@shared/container/providers/WebSocketProvider/fakes/FakeWebSocketProvider';
import FakePollsVotesRepository from '@modules/polls/repositories/fakes/FakePollsVotesRepository';
import FakePollsRepository from '@modules/polls/repositories/fakes/FakePollsRepository';
import CreatePollVoteService from '@modules/polls/services/CreatePollVoteService';

let fakeUsersRepository: FakeUsersRepository;
let fakePollsRepository: FakePollsRepository;
let fakePollsVotesRepository: FakePollsVotesRepository;
let fakeWebSocketProvider: FakeWebSocketProvider;
let createPollVoteService: CreatePollVoteService;

describe('CreatePollVoteService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePollsRepository = new FakePollsRepository();
    fakePollsVotesRepository = new FakePollsVotesRepository();
    fakeWebSocketProvider = new FakeWebSocketProvider();
    createPollVoteService = new CreatePollVoteService(
      fakeUsersRepository,
      fakePollsRepository,
      fakePollsVotesRepository,
      fakeWebSocketProvider,
    );
  });

  it('should be able to create a vote', async () => {
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

    const {
      id: poll_id,
      alternatives: savedAlternatives,
    } = await fakePollsRepository.create({
      user_id: 'teste',
      title: 'Minha votação',
      description: 'Essa votação é demais',
      alternatives,
      ends_at: addDays(new Date(), 7),
    });

    const [alternativeOne] = savedAlternatives;

    const pollVote = await createPollVoteService.execute({
      poll_id,
      poll_alternative_id: alternativeOne.id,
      ip: '123',
      user_agent: 'chrome',
    });

    expect(pollVote.poll_id).toBe(poll_id);
    expect(pollVote.poll_alternative_id).toBe(alternativeOne.id);
  });

  it('should not be able to vote on a poll that dont exists', async () => {
    await expect(
      createPollVoteService.execute({
        poll_id: 'teste',
        poll_alternative_id: 'teste_alternativa',
        ip: '123',
        user_agent: 'chrome',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to vote on a poll with wrong alternative', async () => {
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
      user_id: 'teste',
      title: 'Minha votação',
      description: 'Essa votação é demais',
      alternatives,
      ends_at: addDays(new Date(), 7),
    });

    await expect(
      createPollVoteService.execute({
        poll_id,
        poll_alternative_id: 'teste-alternative',
        ip: '123',
        user_agent: 'chrome',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to vote twice with same ip/user_agent combination', async () => {
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

    const {
      id: poll_id,
      alternatives: savedAlternatives,
    } = await fakePollsRepository.create({
      user_id: 'teste',
      title: 'Minha votação',
      description: 'Essa votação é demais',
      alternatives,
      ends_at: addDays(new Date(), 7),
    });

    const [alternativeOne, alternativeTwo] = savedAlternatives;

    await createPollVoteService.execute({
      poll_id,
      poll_alternative_id: alternativeOne.id,
      ip: '123',
      user_agent: 'chrome',
    });

    await expect(
      createPollVoteService.execute({
        poll_id,
        poll_alternative_id: alternativeTwo.id,
        ip: '123',
        user_agent: 'chrome',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to vote with an authenticated user', async () => {
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

    const {
      id: poll_id,
      alternatives: savedAlternatives,
    } = await fakePollsRepository.create({
      user_id: 'teste',
      title: 'Minha votação',
      description: 'Essa votação é demais',
      alternatives,
      ends_at: addDays(new Date(), 7),
    });

    const [alternativeOne] = savedAlternatives;

    const pollVote = await createPollVoteService.execute({
      poll_id,
      poll_alternative_id: alternativeOne.id,
      user_id: user.id,
      ip: '123',
      user_agent: 'chrome',
    });

    expect(pollVote.poll_id).toBe(poll_id);
    expect(pollVote.poll_alternative_id).toBe(alternativeOne.id);
    expect(pollVote.user_id).toBe(user.id);
  });

  it('should be able to reject a vote on a poll that is expired', async () => {
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

    const {
      id: poll_id,
      alternatives: savedAlternatives,
    } = await fakePollsRepository.create({
      user_id: 'teste',
      title: 'Minha votação',
      description: 'Essa votação é demais',
      alternatives,
      ends_at: subDays(new Date(), 7),
    });

    const [alternativeOne] = savedAlternatives;

    await expect(
      createPollVoteService.execute({
        poll_id,
        poll_alternative_id: alternativeOne.id,
        ip: '123',
        user_agent: 'chrome',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
