import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDisconnect, handleEvent } from './helper.js';
import { addUser } from '../models/user.model.js';

const registerHandler = (io) => {
  // 유저 접속시 (대기하는 함수)
  io.on('connection', (socket) => {
    // 이벤트 처리

    // 유저 등록
    const userUUID = uuidv4();
    addUser({ uuid: userUUID, socketId: socket.id });
    handleConnection(socket, userUUID);

    // 이벤트 처리
    socket.on('event', (data) => handleEvent(io, socket, data));
    // 접속 해제시 이벤트
    socket.on('disconnect', () => handleDisconnect(socket, userUUID));
  });
};

export default registerHandler;
