import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import PollsController from '../controllers/PollsController';

const pollsRouter = Router();
const pollsController = new PollsController();

pollsRouter.post('/', ensureAuthenticated, pollsController.create);
pollsRouter.get('/:id', pollsController.show);

export default pollsRouter;
