import AppError from '@shared/errors/AppError';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT Token is missing');
  }
  const { secret } = authConfig.jwt;
  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, String(secret));

    const { sub: id } = decoded as ITokenPayload;

    request.user = {
      id,
    };

    next();
  } catch {
    throw new AppError('Invalid JWT Token', 401);
  }
}
