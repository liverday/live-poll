import FakePollsRepository from '@modules/polls/repositories/fakes/FakePollsRepository';
import ListUserPollsService from './ListUserPollsService';

let fakePollsRepository: FakePollsRepository;
let listUserPollsService: ListUserPollsService;

describe('ListUserPollsService', () => {
  beforeEach(() => {
    fakePollsRepository = new FakePollsRepository();
    listUserPollsService = new ListUserPollsService(fakePollsRepository);
  });

  it('should be able to fetch data from an user_id', async () => {
    const [pollOne, pollTwo, pollThree] = await Promise.all(
      Array.from({ length: 3 }, (_, i) => {
        return fakePollsRepository.create({
          user_id: 'user-id',
          title: `Votação ${i + 1}`,
          description: `Descrição ${i + 1}`,
          alternatives: [
            {
              title: 'Alternativa',
              color: '#fff',
            },
          ],
        });
      }),
    );

    const polls = await listUserPollsService.execute({
      user_id: 'user-id',
    });

    expect(polls).toEqual([pollOne, pollTwo, pollThree]);
  });
});
