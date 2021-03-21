import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreatePollService from '@modules/polls/services/CreatePollService';
import FindPollService from '@modules/polls/services/FindPollService';

class PollsController {
  async create(request: Request, response: Response): Promise<Response> {
    const { title, description, alternatives } = request.body;
    const { id: user_id } = request.user;
    const createPollService = container.resolve(CreatePollService);

    const poll = await createPollService.execute({
      user_id,
      title,
      description,
      alternatives,
    });

    return response.json({
      ...poll,
      user: classToClass(poll.user),
    });
  }

  async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findPollService = container.resolve(FindPollService);

    const poll = await findPollService.execute({
      poll_id: id,
    });

    return response.json(classToClass(poll));
  }
}

export default PollsController;
