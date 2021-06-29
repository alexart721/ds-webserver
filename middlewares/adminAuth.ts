import { Request, NextFunction, Response } from 'express';

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.roles === 'Admin') {
    next();
  } else {
    res.status(403).send({message: 'You are not authorized to use this feature.'});
  }
};

export default adminAuth;
