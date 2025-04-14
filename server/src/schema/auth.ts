// server/src/services/auth.ts
import jwt from 'jsonwebtoken';
import { Request } from 'express';

const secret = process.env.JWT_SECRET || 'supersecretkey';
const expiration = '2h';

export function signToken(username: string, email: string, _id: string) {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

export function authMiddleware({ req }: { req: Request }) {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop()?.trim();
  }

  if (!token) return req;

  try {
    const { data }: any = jwt.verify(token, secret);
    (req as any).user = data;
  } catch {
    console.warn('Invalid token');
  }

  return req;
}
