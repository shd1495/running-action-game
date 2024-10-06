import { getItemList } from '../models/item.model.js';

/**
 * 획득한 아이템의 점수를 계산하는 함수
 * @param {String} userId
 * @param {Object} items
 * @returns {Int} score
 */
export async function calculateItemScore(userId, items) {
  // 아이템 점수 검증
  let score = 0;
  const userItemList = await getItemList(userId);
  for (const userItem of userItemList) {
    const item = items.data.find((item) => item.id === userItem.itemId);
    if (!item) {
      return { status: '실패', message: '유효하지 않은 아이템이 포함되어 있습니다.' };
    }
    score += item.score;
  }

  return score;
}
