import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

// Redis 클라이언트 설정 (클라우드 환경)
const redisClient = new Redis({
  host: process.env.REDIS_HOST, // Redis 클라우드 호스트
  port: process.env.REDIS_PORT, // Redis 클라우드 포트
  password: process.env.REDIS_PASSWORD, // Redis 비밀번호
});

redisClient.on('connect', () => {
  console.log('Redis connect');
});

redisClient.on('error', (err) => {
  console.error('Redis error: ', err);
});

export default redisClient;
