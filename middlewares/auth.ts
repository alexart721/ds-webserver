import { Request, NextFunction, Response } from 'express';
import fetch from 'node-fetch';
import Users from '../models/user';

const { AUTH_URL } = process.env;

const auth = (role: string) => async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1] as string;
  try {
    fetch(`${AUTH_URL}/checkAccess`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ roles: role })
    }).then(async (fetchRes: any) => {
      fetchRes.json().then(async (json: any) => {
        if (fetchRes.ok) {
          res.locals.user = await Users.findById(json.id).select('-password');
          next();
        } else {
          res.status(fetchRes.status).send(json);
        }
      });
    });
  } catch (e) {
    res.status(500).send({message: 'Internal server error'});
  }
};

export default auth;
