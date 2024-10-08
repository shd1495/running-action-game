import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';
import { TIME, TIME_GAP } from '../utils/constants.js';
import { calculateItemScore } from '../utils/calculate.js';

/**
 * 스테이지 이동 검증
 * @param {String} userId
 * @param {Object} payload
 * @returns
 */
export const moveStageHandler = async (userId, payload) => {
  // 스테이지 단계별 상승
  // 일정 점수를 넘으면 다음 스테이지

  // payload -> 현재 스테이지(currentStages), 다음 스테이지(targetStages)
  // 유저의 현재 스테이지 정보
  let currentStages = await getStage(userId);
  if (!currentStages.length)
    return { status: '실패', message: '유저의 현재 스테이지를 찾을 수 없습니다.' };

  // currentStages 검증
  // 오름차순 -> 유저의 현재 스테이지
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // 클라이언트 vs 서버 비교
  if (currentStage.id !== payload.currentStage)
    return { status: '실패', message: '현재 스테이지가 일치하지 않습니다.' };

  // 현재 스테이지 검증
  const { stages, items } = getGameAssets();
  const currentStageData = stages.data.find((stage) => stage.id === payload.currentStage);
  if (!currentStageData) return { status: '실패', message: '현재 스테이지를 찾을 수 없습니다.' };

  // 다음(목표) 스테이지 검증 < assets에 존재 여부
  const targetStageData = stages.data.find((stage) => stage.id === payload.targetStage);
  if (!targetStageData) return { status: '실패', message: '다음 스테이지를 찾을 수 없습니다.' };

  // 서버 클라이언트 시간차 검증
  const serverTime = Date.now(); // 현재 타임스탬프
  const clientTime = payload.timestamp || 0;

  const timeDifference = Math.abs(serverTime - clientTime);
  if (timeDifference > TIME_GAP)
    return { status: '실패', message: '클라이언트와 서버의 시간이 유효하지 않습니다.' };

  // 점수 검증
  const itemScore = await calculateItemScore(userId, items);

  // 다음 스테이지 목표 점수 = 다음 스테이지 점수 - 현재 스테이지 점수
  const elapsedTime = (serverTime - currentStage.timestamp) / TIME;
  const targetScore = targetStageData.score - currentStageData.score;
  const totalScore = elapsedTime * currentStageData.scorePerSecond + itemScore;
  if (targetScore > totalScore)
    return { status: '실패', message: '유효하지 않은 경과 시간입니다.' };

  await setStage(userId, payload.targetStage, serverTime);

  return {
    status: '성공',
    message: `스테이지 이동에 성공했습니다. 현재 ${payload.targetStage - 999}스테이지 입니다.`,
  };
};
