import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import FindPollService from '@modules/polls/services/FindPollService';

class PollsController {
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
