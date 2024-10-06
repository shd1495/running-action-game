import { CLIENT_VERSION } from '../constants.js';
import { clearItem } from '../models/item.model.js';
import { clearStage } from '../models/stage.model.js';
import { getUsers, removeUser } from '../models/user.model.js';
import { getHighScore } from '../models/score.model.js';
import handlerMappings from './handlerMapping.js';

export const handleDisconnect = async (socket, uuid) => {
  removeUser(uuid);
  clearStage(uuid);
  clearItem(uuid);
  console.log(`${uuid} 유저가 연결을 해제했습니다`);
  console.log('현재 접속 중인 유저들:', await getUsers());
};

// 스테이지에 따라 더 높은 점수 획득
// 1스테이지 -> 0점, 1점씩 획득
// 2스테이지 -> 1000점, 2점씩 획득

export const handleConnection = async (socket, uuid) => {
  console.log('새로운 유저가 연결되었습니다.', 'uuid: ', uuid, 'socketId: ', socket.id);
  console.log('현재 접속 중인 유저들:', await getUsers());

  // 최고 점수를 가져와 클라이언트로 전달
  const highScore = await getHighScore();
  socket.emit('getHighScore', highScore);

  if (uuid == highScore?.uuid) {
    socket.emit('highestRecordUser', { uuid });
  }

  clearStage(uuid);

  // 클라이언트 버전 체크 추가 필요

  socket.emit('connection', { uuid });
};

export const handleEvent = async (io, socket, data) => {
  // 클라언트 버전 체크
  //if (!data.CLIENT_VERSION) throw new Error('클라이언트 버전이 존재하지 않습니다.');
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: '실패', message: '클라이언트 버전이 맞지 않습니다.' });
    return;
  }

  // 핸들러 체크
  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: '실패', message: '핸들러를 찾을 수 없습니다.' });
    return;
  }

  const response = await handler(data.userId, data.payload, io);

  // 한 유저에게 보낼시
  socket.emit('response', response);
};
