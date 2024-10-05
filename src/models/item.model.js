import redisClient from '../init/redis.js';

const ITEM_SET = 'item';

export const clearItem = (uuid) => {
  try {
    redisClient.del(ITEM_SET + uuid);
  } catch (error) {
    throw new Error('아이템 목록 초기화 중 오류가 발생했습니다.' + error.message);
  }
};

export const setItem = async (uuid, item) => {
  try {
    await redisClient.rpush(ITEM_SET + uuid, JSON.stringify(item));
  } catch (error) {
    throw new Error('아이템 설정 중 오류가 발생했습니다.' + error.message);
  }
};

export const getItemList = async (uuid) => {
  try {
    const items = await redisClient.lrange(ITEM_SET + uuid, 0, -1);
    const result = items.map((item) => JSON.parse(item));
    return result;
  } catch (error) {
    throw new Error('아이템 목록을 불러오는 중 오류가 발생했습니다.' + error.message);
  }
};
