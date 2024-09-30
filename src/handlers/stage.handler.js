import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';

export const moveStageHandler = (userId, payload) => {
  // 스테이지 단계별 상승
  // 일정 점수를 넘으면 다음 스테이지

  // payload -> 현재 스테이지(currentStages), 다음 스테이지(targetStages)
  // 유저의 현재 스테이지 정보
  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: '실패', message: '유저의 현재 스테이지를 찾을 수 없습니다.' };
  }

  // currentStages 검증
  // 오름차순 -> 유저의 현재 스테이지
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // 클라이언트 vs 서버 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: '실패', message: '현재 스테이지가 일치하지 않습니다.' };
  }

  const { stages } = getGameAssets();
  const currentStageData = stages.data.filter((stage) => stage.id === payload.currentStage);
  console.log('current', currentStageData);
  if (currentStageData.length === 0) {
    return { status: '실패', message: '현재 스테이지를 찾을 수 없습니다.' };
  }

  // targetStage 검증 < assets에 존재 여부
  const targetStageData = stages.data.filter((stage) => stage.id === payload.targetStage);
  console.log('target', targetStageData);
  if (targetStageData.length === 0) {
    return { status: '실패', message: '다음 스테이지를 찾을 수 없습니다.' };
  }

  // 점수 검증
  const serverTime = Date.now(); // 현재 타임스탬프
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000; // 1초당 점수

  // 1스테이지 -> 2스테이지
  // 5 -> 임의로 정한 오차 범위
  // 다음 스테이지의 점수를 가져와서 그 점수를 기준으로 조건문 수정
  // if (elapsedTime < 100 || elapsedTime > 105) {
  //   return { status: '실패', message: '유효하지 않은 경과 시간입니다.' };
  // }

  // 현재 점수와 데이터 테이블의 점수를 비교해서 현재 점수가 데이터 테이블의 점수보다 높을 경우 스테이지 이동

  setStage(userId, payload.targetStage, serverTime);

  return { status: '성공' };
};
