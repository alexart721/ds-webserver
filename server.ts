import http from 'http';
import express, { Response } from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import router from './router';
import bootRedis from './redisDb';

const REDIS_URL = String(process.env.REDIS_URL);

const bootServer = (PORT: number): http.Server => {
  const redisClient = bootRedis(REDIS_URL);

  const app = express();

  app.locals.client = redisClient;
  app.use(cors());
  app.use(express.json());
  app.use(router);

  app.get('*', (_, res: Response) => {
    res.status(404).send('Page not found');
  });

  app.post('*', (_, res: Response) => {
    res.status(404).send('Page not found');
  });

  const server = http.createServer(app);
  const io = new Server(server);

  io.on('connection', () => { /* … */ });

  server.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
  });

  return server;
};

export default bootServer;
