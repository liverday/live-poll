import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function getUserAuthenticatedIfExists(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    next();
    return;
  }

  const { secret } = authConfig.jwt;
  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, String(secret));

    const { sub: id } = decoded as ITokenPayload;

    request.user = {
      id,
    };
  } catch (err) {
    console.error(err);
  } finally {
    next();
  }
}
