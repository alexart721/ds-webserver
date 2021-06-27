import { Request } from 'express';
import { UserData } from './models/user';

export interface ExtendedRequest extends Request {
  user: UserData;
  tokenExp: Number | undefined;
  token: String;
}
