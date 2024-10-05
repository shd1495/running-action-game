import redisClient from '../init/redis.js';

const STAGE_SET = 'stage';

// key: uuid, value: array -> stage 정보는 배열이다.

// 스테이지 초기화
export const clearStage = (uuid) => {
  try {
    redisClient.del(STAGE_SET + uuid);
  } catch (error) {
    throw new Error('스테이지 초기화 중 오류가 발생했습니다. ' + error.message);
  }
};

export const getStage = async (uuid) => {
  try {
    const stages = await redisClient.lrange(STAGE_SET + uuid, 0, -1);
    const result = stages.map((stage) => JSON.parse(stage));
    return result;
  } catch (error) {
    throw new Error('스테이지를 불러오는 중 오류가 발생했습니다.' + error.message);
  }
};

export const setStage = async (uuid, id, timestamp) => {
  try {
    await redisClient.rpush(STAGE_SET + uuid, JSON.stringify({ id, timestamp }));
  } catch (error) {
    throw new Error('스테이지 설정 중 오류가 발생했습니다.' + error.message);
  }
};
