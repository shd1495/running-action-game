import item from '../assets/dataTables/item.json' with { type: 'json' };
import itemUnlock from '../assets/dataTables/item_unlock.json' with { type: 'json' };
import stage from '../assets/dataTables/stage.json' with { type: 'json' };

export const CLIENT_VERSION = '1.0.0';

export const GAME_SPEED_START = 1;
export const GAME_SPEED_INCREMENT = 0.00001;

export const FIRST_STAGE_ID = 1000;

// 게임 크기
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 200;

// 플레이어
// 800 * 200 사이즈의 캔버스에서는 이미지의 기본크기가 크기때문에 1.5로 나눈 값을 사용. (비율 유지)
export const PLAYER_WIDTH = 88 / 1.5; // 58
export const PLAYER_HEIGHT = 94 / 1.5; // 62
export const MAX_JUMP_HEIGHT = GAME_HEIGHT;
export const MIN_JUMP_HEIGHT = 150;

// 땅
export const GROUND_WIDTH = 1800;
export const GROUND_HEIGHT = 200;
export const GROUND_SPEED = 0.5;

// 선인장
export const ENEMY_CONFIG = [
  { width: 88 / 1.5, height: 100 / 1.5, image: '../assets/images/banshee.png' },
  { width: 98 / 1.5, height: 100 / 1.5, image: '../assets/images/ghost.png' },
  { width: 68 / 1.5, height: 70 / 1.5, image: '../assets/images/skel.png' },
];

// 아이템
export const ITEM_CONFIG = item.data;

// 아이템 해금
export const ITEM_UNLOCK = itemUnlock.data;

// 스테이지
export const STAGE_CONFIG = stage.data;
