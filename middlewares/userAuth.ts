import { Request, NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RedisError } from 'redis';
import User from '../models/user';

const { SECRET_KEY } = process.env;

const userAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) return res.sendStatus(400);
  const token = authHeaders.split(' ')[1];
  const redisClient = req.app.locals.client;

  redisClient.get(`blacklist_${token}`, (err: RedisError, data: string) => {
    if (err) return res.status(500).send({ err, message: 'An error occurred.' });
    if (data) return res.status(401).send({ message: 'Please login again.' });
  });

  try {
    if (SECRET_KEY) {
      const { id, exp } = jwt.verify(token, SECRET_KEY) as JwtPayload;
      const user = await User.findOne({ _id: id });
      if (!user) return res.sendStatus(401);
      res.locals.user = user;
      res.locals.tokenExp = exp;
      res.locals.token = token; // Might not need this
      res.locals.roles = user.roles;
      next();
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    res.sendStatus(401);
  }
};

export default userAuth;
