import AppError from '@shared/errors/AppError';

import FakePollsRepository from '../repositories/fakes/FakePollsRepository';
import FakePollsVotesRepository from '../repositories/fakes/FakePollsVotesRepository';
import FindPollResultsService from './FindPollResultsService';

let fakePollsRepository: FakePollsRepository;
let fakePollsVotesRepository: FakePollsVotesRepository;
let findPollResultsService: FindPollResultsService;

describe('FindPollResultsService', () => {
  beforeEach(() => {
    fakePollsRepository = new FakePollsRepository();
    fakePollsVotesRepository = new FakePollsVotesRepository();
    findPollResultsService = new FindPollResultsService(
      fakePollsRepository,
      fakePollsVotesRepository,
    );
  });

  it('should be able to fetch results from a poll', async () => {
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
      user_id: 'user',
      title: 'Minha votação',
      description: 'Essa votação é demais',
      alternatives,
      ends_at: new Date(),
    });

    await Promise.all(
      Array.from({ length: 10 }, () => {
        return fakePollsVotesRepository.create({
          poll_id,
          poll_alternative_id:
            savedAlternatives[
              Math.floor(Math.random() * savedAlternatives.length)
            ].id,
          ip: '',
          user_agent: '',
        });
      }),
    );

    const pollResults = await findPollResultsService.execute({
      poll_id,
    });

    expect(pollResults.total).toBe(10);
  });

  it('should be able to reject a result fetch from a poll that dont exists', async () => {
    await expect(
      findPollResultsService.execute({
        poll_id: 'poll',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
