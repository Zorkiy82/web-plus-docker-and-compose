import { Request } from 'express';

export type TUserData = { id: number };

export interface CastomRequest extends Request {
  user: TUserData;
}
