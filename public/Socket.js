import { CLIENT_VERSION } from './Constants.js';

// 연결 주소
const socket = io('http://localhost:3030', {
  // connection에서 클라이언트 버전을 체크하기 위해
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;
socket.on('response', (data) => {
  console.log(data);
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  // 연결됐을 때 userId에 userUUID 저장
  userId = data.uuid;
});

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export { sendEvent };
