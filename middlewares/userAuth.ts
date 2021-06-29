import { Request, NextFunction, Response } from 'express';
// import redisClient from 'index';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RedisError } from 'redis';
import User from '../models/user';

const { SECRET_KEY } = process.env;

const userAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) return res.sendStatus(403);
  const token = authHeaders.split(' ')[1];
  const redisClient = req.app.locals.client;

  redisClient.get(`blacklist_${token}`, (err: RedisError, data: string) => {
    if (err) return res.status(400).send({ err, message: 'An error occurred, logging out.' });
    if (data) return res.status(400).send({ message: 'Please login again.' });
  });

  try {
    if (SECRET_KEY) {
      const { id, exp } = jwt.verify(token, SECRET_KEY) as JwtPayload;
      const user = await User.findOne({ where: { _id: id } });
      if (!user) return res.sendStatus(401);
      res.locals.user = user;
      res.locals.tokenExp = exp;
      res.locals.token = token; // Might not need this
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.sendStatus(401);
  }
};

export default userAuth;
