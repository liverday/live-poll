import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreatePollVoteService from '@modules/polls/services/CreatePollVoteService';

class PollsVotesController {
  async create(request: Request, response: Response): Promise<Response> {
    const { poll_id, poll_alternative_id } = request.body;
    const { user, ip } = request;
    const user_agent = request.get('user-agent')!;

    const createPollVoteService = container.resolve(CreatePollVoteService);

    const pollVote = await createPollVoteService.execute({
      poll_id,
      poll_alternative_id,
      ip,
      user_agent,
      user_id: user?.id,
    });

    return response.json(pollVote);
  }
}

export default PollsVotesController;
