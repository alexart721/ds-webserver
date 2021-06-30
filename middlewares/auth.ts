import { Request, NextFunction, Response } from 'express';
import fetch from 'node-fetch';

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
    }).then((fetchRes: any) => {
      if (fetchRes.ok) {
        next();
      } else {
        fetchRes.json().then((json: any) => {
          res.status(fetchRes.status).send(json);
        });
      }
    });
  } catch (e) {
    res.status(500).send({message: 'Internal server error'});
  }
};

export default auth;
