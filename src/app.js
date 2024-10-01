import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.SECRET_PORT;

const app = express();
const server = createServer(app);

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
// 소켓 초기화
initSocket(server);

server.listen(PORT, async () => {
  console.log(`${PORT} 포트로 서버가 열렸습니다.`);

  // 유저 관리
  // 여기서 파일 읽기
  try {
    const assets = await loadGameAssets();
    console.log('assets 파일이 정상적으로 로드되었습니다.');
  } catch (error) {
    console.error('assets 파일을 불러오는 데 실패했습니다.', error);
  }
});
