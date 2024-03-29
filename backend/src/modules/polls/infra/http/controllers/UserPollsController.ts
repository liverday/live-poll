import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToPlain } from 'class-transformer';

import CreatePollService from '@modules/polls/services/CreatePollService';
import ListUserPollsService from '@modules/polls/services/ListUserPollsService';

class UserPollsController {
  async create(request: Request, response: Response): Promise<Response> {
    const { title, description, alternatives, ends_at } = request.body;
    const { id: user_id } = request.user;
    const createPollService = container.resolve(CreatePollService);

    const poll = await createPollService.execute({
      user_id,
      title,
      description,
      alternatives,
      ends_at,
    });

    return response.json({
      ...poll,
      user: instanceToPlain(poll.user),
    });
  }

  async index(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;

    const listUserPollsService = container.resolve(ListUserPollsService);

    const polls = await listUserPollsService.execute({
      user_id,
    });

    return response.json(instanceToPlain(polls));
  }
}

export default UserPollsController;
