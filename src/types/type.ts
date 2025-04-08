import { Request } from 'express';

export interface JwtPayload {
  id: number;
  username: string;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
