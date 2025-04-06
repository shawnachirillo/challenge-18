import jwt from 'jsonwebtoken';
import { Request } from 'express';

const secret = 'mysecretsshhhhh';
const expiration = '2h';

export function signToken({ username, email, _id }: any) {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

export function authMiddleware({ req }: { req: Request }) {
  // Get token from headers
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop()?.trim();
  }

  if (!token) return req;

  try {
    const { data }: any = jwt.verify(token, secret);
    (req as any).user = data;
  } catch (err) {
    console.error('Invalid token');
  }

  return req;
}
