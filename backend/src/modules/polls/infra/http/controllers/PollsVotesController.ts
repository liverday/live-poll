import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreatePollVoteService from '@modules/polls/services/CreatePollVoteService';
import FindPollResultsService from '@modules/polls/services/FindPollResultsService';

class PollsVotesController {
  async create(request: Request, response: Response): Promise<Response> {
    const { poll_alternative_id } = request.body;
    const { id: poll_id } = request.params;
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

  async show(request: Request, response: Response): Promise<Response> {
    const { id: poll_id } = request.params;

    const findPollResultsService = container.resolve(FindPollResultsService);

    const pollResults = await findPollResultsService.execute({
      poll_id,
    });

    return response.json(pollResults);
  }
}

export default PollsVotesController;
