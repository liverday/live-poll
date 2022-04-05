import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToPlain } from 'class-transformer';

import FindPollService from '@modules/polls/services/FindPollService';
import ListUserPollsService from '@modules/polls/services/ListUserPollsService';

class PollsController {
  async index(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;

    const listUserPollsService = container.resolve(ListUserPollsService);

    const polls = await listUserPollsService.execute({
      user_id
    })

    return response.json(polls);
  }

  async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findPollService = container.resolve(FindPollService);

    const poll = await findPollService.execute({
      poll_id: id,
    });

    return response.json(instanceToPlain(poll));
  }
}

export default PollsController;
