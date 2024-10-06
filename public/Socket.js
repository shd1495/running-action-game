import { CLIENT_VERSION } from './utils/Constants.js';
import Score from './components/score/Score.js';

let userId = localStorage.getItem('userId') || '';
// 연결 주소
const socket = io('http://localhost:3030', {
  // connection에서 클라이언트 버전을 체크하기 위해
  query: {
    clientVersion: CLIENT_VERSION,
    userId,
  },
});

// 최고 기록 보유자가 접속시
socket.on('highestRecordUser', (data) => {
  console.log(`최고 기록 보유자 ${data.uuid}님 환영합니다.`);
});

socket.on('response', (data) => {
  console.log(data);
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  // 연결됐을 때 userId에 userUUID 저장
  userId = data.uuid;
  localStorage.setItem('userId', userId);
});

// 유저 연결시 최고 기록 업데이트
socket.on('getHighScore', (data) => {
  const scoreInstance = Score.instance;
  if (scoreInstance && data?.score) {
    scoreInstance.highScore = data.score;
  } else {
    scoreInstance.highScore = 0;
  }
});

// 최고 점수 이벤트 수신
socket.on('highScore', (data) => {
  console.log(`${data.uuid} 님이 ${parseInt(data.score)}점을 기록하여 최고 점수를 달성했습니다.`);
  const scoreInstance = Score.instance;
  if (scoreInstance) {
    scoreInstance.highScore = data.score;
    scoreInstance.isHighScore = true;
  }
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
