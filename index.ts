import bootServer from './server';
import bootDb from './db';
// import bootRedis from './redisDb';

const PORT = Number(process.env.PORT);
const url = String(process.env.DB_BASE_URL);
const DB_NAME = String(process.env.DB_NAME);
// const REDIS_URL = String(process.env.REDIS_URL);

bootDb(url, DB_NAME);
// bootRedis(REDIS_URL);
bootServer(PORT);
