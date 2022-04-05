import { v4 as uuid } from 'uuid';

process.env.JWT_SECRET = uuid();
process.env.JWT_EXPIRES_IN = (60 * 60).toString();