import redisClient from '../init/redis.js';

const ITEM_SET = 'item';

/**
 * 유저의 아이템 목록 초기화
 * @param {String} uuid
 */
export const clearItem = (uuid) => {
  try {
    redisClient.del(ITEM_SET + uuid);
  } catch (error) {
    throw new Error('아이템 목록 초기화 중 오류가 발생했습니다.' + error.message);
  }
};

/**
 * 유저의 획득 아이템 설정
 * @param {String} uuid
 * @param {Object} item
 */
export const setItem = async (uuid, item) => {
  try {
    await redisClient.rpush(ITEM_SET + uuid, JSON.stringify(item));
  } catch (error) {
    throw new Error('아이템 설정 중 오류가 발생했습니다.' + error.message);
  }
};

/**
 * 유저의 획득 아이템 목록 조회
 * @param {String} uuid
 * @returns {Object}
 */
export const getItemList = async (uuid) => {
  try {
    const items = await redisClient.lrange(ITEM_SET + uuid, 0, -1);
    const result = items.map((item) => JSON.parse(item));
    return result;
  } catch (error) {
    throw new Error('아이템 목록을 불러오는 중 오류가 발생했습니다.' + error.message);
  }
};
