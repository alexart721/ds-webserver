import { Request, Response } from 'express';
import s3 from '../s3';

const getImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const key = req.params.id;
    const readStream = s3.getFileStream(key);
    readStream.pipe(res);
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: 'Internal error' });
  }
};

export default {
  getImage,
};
