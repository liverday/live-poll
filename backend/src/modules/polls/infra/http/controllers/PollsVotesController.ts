import { Request, Response } from 'express';

class PollsVotesController {
  async create(request: Request, response: Response): Promise<Response> {
    return response.json();
  }
}

export default PollsVotesController;
