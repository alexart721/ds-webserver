import http from 'http';
import express, { Response, Request } from 'express';
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

  app.use((req: Request, res: Response) => {
    console.log(`Request made to ${req.url}`);
    res.status(404).send(`Page not found on server [${req.url}]`);
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
