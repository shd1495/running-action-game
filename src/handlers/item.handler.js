import { getGameAssets } from '../init/assets.js';
import { setItem } from '../models/item.model.js';
import { getStage } from '../models/stage.model.js';

/**
 * 아이템 점수 검증
 * @param {String} userId
 * @param {Object} payload
 * @returns {Object}
 */
export const getItemScoreHandler = async (userId, payload) => {
  const { items, itemUnlocks } = getGameAssets();
  const { timestamp, itemId } = payload;

  // 현재 스테이지에서 생성되는 아이템인지 검증
  const stages = await getStage(userId);
  if (!stages) return { status: '실패', message: '스테이지를 찾을 수 없습니다.' };
  const stageItem = itemUnlocks.data.find((item) => item.stageId === stages[stages.length - 1]?.id);
  if (!stageItem.itemId.includes(itemId))
    return { status: '실패', message: '현재 스테이지에 등장하지 않는 아이템입니다.' };

  // 아이템 존재 검증
  const userGetItem = items.data.find((item) => item.id === itemId);
  if (!userGetItem)
    return { status: '실패', message: '획득한 아이템이 존재하지 않는 아이템입니다.' };

  // 아이템 생성 간격 검증

  await setItem(userId, { timestamp, itemId });
  return { status: '성공', message: `아이템을 획득해 점수가 ${userGetItem.score}만큼 상승합니다.` };
};
