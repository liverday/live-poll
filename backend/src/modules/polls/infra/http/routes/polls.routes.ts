import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import getUserAuthenticatedIfExists from '@modules/users/infra/http/middlewares/getUserAuthenticatedIfExists';

import PollsController from '../controllers/PollsController';
import UserPollsController from '../controllers/UserPollsController';
import PollsVotesController from '../controllers/PollsVotesController';

const pollsRouter = Router();
const pollsController = new PollsController();
const userPollsController = new UserPollsController();
const pollsVotesController = new PollsVotesController();

pollsRouter.post('/', ensureAuthenticated, userPollsController.create);
pollsRouter.get('/mine', ensureAuthenticated, userPollsController.index);
pollsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  pollsController.show,
);
pollsRouter.post(
  '/:id/vote',
  getUserAuthenticatedIfExists,
  celebrate({
    [Segments.BODY]: {
      poll_id: Joi.string().uuid().required(),
      poll_alternative_id: Joi.string().uuid().required(),
    },
  }),
  pollsVotesController.create,
);

export default pollsRouter;
