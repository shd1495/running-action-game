import { getGameAssets } from '../init/assets.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();
  clearStage(uuid);
  // stages 배열에서 0번째 -> 첫 스테이지
  // 클라이언트의 정보를 그대로 저장하는 부분 주의
  setStage(uuid, stages.data[0].id, payload.timestamp);
  //console.log('Stage: ', getStage(uuid));

  return { status: '성공' };
};

export const gameEnd = () => {
  // 클라이언트는 게임 종료 시 타임스탬프와 총 점수
  const { timestamp: gameEndTime, score } = payload;

  const stages = getStage(uuid);
  if (!stages.length) {
    return { status: '실패', message: '유저의 스테이지를 찾을 수 없습니다.' };
  }

  // 각 스테이지의 지속 시간을 계산하여 총 점수 계산
  let totalScore = 0;

  stages.forEach((stage, idx) => {
    let stageEndTime;
    if (idx === stage.length - 1) {
      // 마지막 스테이지의 경우
      stageEndTime = gameEndTime;
    } else {
      // 다음 스테이지의 시간을 현재 스테이지의 종료 시간으로 사용
      stageEndTime = stages[idx + 1].timestamp;
    }
    // 각 스테이지당 획득 점수로 수정 필요
    const stageDuration = (stageEndTime - stage.timestamp) / 1000;
    totalScore += stageDuration; // 1초당 1점
  });

  // 점수와 타임스탬프 검증
  // 오차 범위 5
  if (Math.abs(score - totalScore) > 5) {
    return { status: '실패', message: '점수 검증에 실패했습니다.' };
  }

  // DB에 저장 시
  // 저장 로직
  // setResult(userId, score, timestamp)

  return { status: '성공', message: '게임 끝', score };
};
