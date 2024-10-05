import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDisconnect, handleEvent } from './helper.js';
import { addUser, getUser } from '../models/user.model.js';
import { getHighScore } from '../models/score.model.js';

const registerHandler = (io) => {
  // 유저 접속시 (대기하는 함수)
  io.on('connection', async (socket) => {
    // 이벤트 처리
    let user = {};
    const userId = socket.handshake.query.userId;
    if (userId) {
      user = await getUser(userId);
      if (!user) {
        user = {};
        user.uuid = userId;
      }
      user.socketId = socket.id;
    } else {
      user.uuid = uuidv4();
      user.socketId = socket.id;
    }
    // 유저 등록
    await addUser(user);
    handleConnection(socket, user.uuid);

    // 최고 점수를 가져와 클라이언트로 전달
    const highScore = await getHighScore();
    socket.emit('getHighScore', highScore);

    if (user.uuid == highScore?.uuid) {
      socket.emit('highestRecordUser', { uuid: user.uuid });
    }

    // 이벤트 처리
    socket.on('event', (data) => handleEvent(io, socket, data));
    // 접속 해제시 이벤트
    socket.on('disconnect', () => handleDisconnect(socket, user.uuid));
  });
};

export default registerHandler;
