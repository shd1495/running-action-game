import redisClient from '../init/redis.js';

const SCORE_SET = 'score';

/**
 * 최고 기록 설정
 * @param {String} uuid
 * @param {Int} score
 */
export const setHighScore = async (uuid, score) => {
  try {
    await redisClient.zadd(SCORE_SET, 'GT', score, uuid);
  } catch (error) {
    throw new Error('최대 점수 기록을 저장하는 중 오류가 발생했습니다.' + error.message);
  }
};

/**
 * 최고 기록 조회
 * @returns {Object || null}
 */
export const getHighScore = async () => {
  try {
    // 최고 점수를 가진 유저를 가져옴
    const HighScoreUser = await redisClient.zrevrange(SCORE_SET, 0, 0, 'WITHSCORES');
    if (HighScoreUser.length > 0) {
      const user = {
        uuid: HighScoreUser[0],
        score: HighScoreUser[1],
      };
      return user;
    }
    return null; // 점수가 없으면 null 반환
  } catch (error) {
    throw new Error('최고 점수를 조회하는 중 오류가 발생했습니다. ' + error.message);
  }
};
