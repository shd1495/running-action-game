import Player from './Player.js';
import Ground from './Ground.js';
import EnemyController from './enemyController.js';
import Score from './Score.js';
import ItemController from './ItemController.js';
import { sendEvent } from './Socket.js';
import {
  GAME_SPEED_START,
  GAME_SPEED_INCREMENT,
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  MAX_JUMP_HEIGHT,
  MIN_JUMP_HEIGHT,
  GROUND_WIDTH,
  GROUND_HEIGHT,
  GROUND_SPEED,
  ENEMY_CONFIG,
  ITEM_CONFIG,
  STAGE_CONFIG,
  ITEM_UNLOCK,
} from './Constants.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// 게임 요소들
let player = null;
let ground = null;
let enemyController = null;
let itemController = null;
let score = null;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameover = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

let bgm = null;
let bgmInitialized = false;

function createSprites() {
  // 비율에 맞는 크기
  // 유저
  const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
  const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
  const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
  const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

  // 땅
  const groundWidthInGame = GROUND_WIDTH * scaleRatio;
  const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

  player = new Player(
    ctx,
    playerWidthInGame,
    playerHeightInGame,
    minJumpHeightInGame,
    maxJumpHeightInGame,
    scaleRatio,
  );

  ground = new Ground(ctx, groundWidthInGame, groundHeightInGame, GROUND_SPEED, scaleRatio);

  const enemyImages = ENEMY_CONFIG.map((enemy) => {
    const image = new Image();
    image.src = enemy.image;
    return {
      image,
      width: enemy.width * scaleRatio,
      height: enemy.height * scaleRatio,
    };
  });

  enemyController = new EnemyController(ctx, enemyImages, scaleRatio, GROUND_SPEED);

  const itemImages = ITEM_CONFIG.map((item) => {
    const image = new Image();
    image.src = item.image;
    return {
      image,
      id: item.id,
      width: item.width * scaleRatio,
      height: item.height * scaleRatio,
    };
  });

  itemController = new ItemController(ctx, itemImages, scaleRatio, GROUND_SPEED, ITEM_UNLOCK);

  score = new Score(ctx, scaleRatio, STAGE_CONFIG, ITEM_CONFIG, itemController);
}

function initializeBGM() {
  if (!bgmInitialized) {
    bgm = new Audio('sounds/bgm.wav');
    bgm.loop = true;
    bgm.volume = 0.25;
    bgm.play();
    bgmInitialized = true;
  }
}

// 유저가 문서와 상호작용할 때 BGM 실행
window.addEventListener('click', initializeBGM);
window.addEventListener('keydown', initializeBGM);

function getScaleRatio() {
  const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
  const screenWidth = Math.min(window.innerHeight, document.documentElement.clientWidth);

  // window is wider than the game width
  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}

function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;
  createSprites();
}

setScreen();
window.addEventListener('resize', setScreen);

if (screen.orientation) {
  screen.orientation.addEventListener('change', setScreen);
}

function showGameOver() {
  const fontSize = 70 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = 'white';
  const x = canvas.width / 4.5;
  const y = canvas.height / 2;
  ctx.fillText('GAME OVER', x, y);
}

function showChangeStage() {
  const fontSize = 70 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = 'white';
  const x = canvas.width / 3;
  const y = canvas.height / 2;
  ctx.fillText(`Stage ${score.currentStageId - 999}`, x, y);
}

function showChangeHighScore() {
  const fontSize = 30 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = 'white';
  const x = canvas.width / 16;
  const y = canvas.height / 2;
  ctx.fillText(`!Congratulation! you got the highest score! ${parseInt(score.score)}`, x, y);
}

function showStartGameText() {
  const fontSize = 40 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = 'white';
  const x = canvas.width / 14;
  const y = canvas.height / 2;
  ctx.fillText('Tap Screen or Press Space To Start', x, y);
}

function updateGameSpeed(deltaTime) {
  gameSpeed += deltaTime * GAME_SPEED_INCREMENT;
}

function reset() {
  hasAddedEventListenersForRestart = false;
  gameover = false;
  waitingToStart = false;

  ground.reset();
  enemyController.reset();
  itemController.reset();
  score.reset();
  gameSpeed = GAME_SPEED_START;
  // 게임시작 핸들러ID 2, payload 에는 게임 시작 시간
  sendEvent(2, { timestamp: Date.now() });
}

function setupGameReset() {
  if (!hasAddedEventListenersForRestart) {
    hasAddedEventListenersForRestart = true;

    setTimeout(() => {
      window.addEventListener('keyup', reset, { once: true });
    }, 1000);
  }
}

function clearScreen() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(currentTime) {
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }

  // 모든 환경에서 같은 게임 속도를 유지하기 위해 구하는 값
  // 프레임 렌더링 속도
  const deltaTime = currentTime - previousTime;
  previousTime = currentTime;

  clearScreen();

  if (!gameover && !waitingToStart) {
    // update
    // 땅이 움직임
    ground.update(gameSpeed, deltaTime);
    score.isHighScore = false;
    // 선인장
    enemyController.update(gameSpeed, deltaTime);
    itemController.update(gameSpeed, deltaTime);
    // 달리기
    player.update(gameSpeed, deltaTime);
    updateGameSpeed(deltaTime);

    score.update(deltaTime);
  }

  if (!gameover && enemyController.collideWith(player)) {
    gameover = true;
    const currentScore = score.score;
    if (currentScore > score.highScore) {
      score.isHighScore = true;
      score.setHighScore();
    }
    player.die();
    setupGameReset();
    sendEvent(3, { timestamp: Date.now(), score: score.score });
  }
  const collideWithItem = itemController.collideWith(player);
  if (collideWithItem && collideWithItem.itemId) {
    score.getItem(collideWithItem.itemId);
  }

  // draw
  ground.draw();
  player.draw();
  enemyController.draw();
  itemController.draw();
  score.draw();

  if (gameover && score.isHighScore) {
    showChangeHighScore();
  } else if (gameover) {
    showGameOver();
  }

  if (waitingToStart) {
    showStartGameText();
  }

  if (!score.stageChange) {
    showChangeStage();
  }

  // 재귀 호출 (무한반복)
  requestAnimationFrame(gameLoop);
}

// 게임 프레임을 다시 그리는 메서드
requestAnimationFrame(gameLoop);

window.addEventListener('keyup', reset, { once: true });
