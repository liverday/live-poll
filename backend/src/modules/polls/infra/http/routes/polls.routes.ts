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

// authenticated routes
pollsRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().required(),
      description: Joi.string(),
      alternatives: Joi.array().items(
        Joi.object({
          title: Joi.string().required(),
          color: Joi.string().required(),
        }),
      ),
      ends_at: Joi.date().required(),
    },
  }),
  userPollsController.create,
);
pollsRouter.get('/mine', ensureAuthenticated, userPollsController.index);

// unauthenticated routes
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
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      poll_alternative_id: Joi.string().uuid().required(),
    },
  }),
  pollsVotesController.create,
);
pollsRouter.get(
  '/:id/results',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  pollsVotesController.show,
);

export default pollsRouter;
