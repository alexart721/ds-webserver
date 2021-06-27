import { NextFunction, Request, Response } from 'express';

const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { SECRET_KEY } = process.env;

interface ExtendedRequest extends Request {
  user: User;
  tokenExp: Number;
  token: String;
}

const userAuth = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) return res.sendStatus(403);
  const token = authHeaders.split(' ')[1];

  try {
    const { id, exp } = jwt.verify(token, SECRET_KEY);
    const user = await User.findOne({ where: { _id: id } });
    if (!user) return res.sendStatus(401);
    req.user = user;
    req.tokenExp = exp;
    req.token = token;
    next();
  } catch (error) {
    res.sendStatus(401);
  }
};

module.exports = userAuth;
