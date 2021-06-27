import { NextFunction, Response } from 'express';
import { ExtendedRequest } from 'interfaces';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user';

const { SECRET_KEY } = process.env;

const adminAuth = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) return res.sendStatus(403);
  const token = authHeaders.split(' ')[1];

  try {
    if (SECRET_KEY) {
      const { id, exp } = jwt.verify(token, SECRET_KEY) as JwtPayload;
      const user = await User.findOne({ where: { _id: id } });
      if (!user || user.roles !== 'Admin') return res.sendStatus(401);
      req.user = user;
      req.tokenExp = exp;
      req.token = token; // Might not need this
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.sendStatus(401);
  }
};

module.exports = adminAuth;
