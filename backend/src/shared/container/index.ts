import { container } from 'tsyringe';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import PollsRepository from '@modules/polls/infra/typeorm/repositories/PollsRepository';
import IPollsRepository from '@modules/polls/repositories/IPollsRepository';

import './providers';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IPollsRepository>(
  'PollsRepository',
  PollsRepository,
);
