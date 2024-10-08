import { sendEvent } from '../../Socket.js';
import { FIRST_STAGE_ID } from '../../utils/Constants.js';

class Score {
  static instance = null;
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  currentStageId = FIRST_STAGE_ID;
  highScore = 0;
  isHighScore = false;

  constructor(ctx, scaleRatio, stageData, itemData, itemController, ground) {
    if (Score.instance) {
      return Score.instance; // 이미 인스턴스가 있다면 그 인스턴스를 반환
    }
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.stageData = stageData;
    this.itemData = itemData;
    this.itemController = itemController;
    this.itemGetSound = new Audio('../assets/sounds/getItem.wav');
    this.ground = ground;

    Score.instance = this;
  }

  update(deltaTime) {
    // 스테이지 데이터 데이블
    const stages = this.stageData;
    // 현재 스테이지 정보
    const currStage = stages.find((stage) => stage.id === this.currentStageId);
    const nextStage = stages.find((stage) => stage.id === this.currentStageId + 1);

    this.score += currStage.scorePerSecond * deltaTime * 0.001;
    // 점수가 100점 이상이 될 시 서버에 메세지 전송
    if (this.score >= nextStage?.score) {
      // 메시지
    }
    // 다음 스테이지 필요 점수에 도달시 다음 스테이지로 이동
    if (Math.floor(this.score) >= nextStage?.score && this.stageChange) {
      this.stageChange = false;
      sendEvent(11, {
        currentStage: currStage.id,
        targetStage: nextStage.id,
        timestamp: Date.now(),
      });
      this.currentStageId = nextStage.id;
      // 아이템 컨트롤러 현재 스테이지 설정
      this.itemController.setCurrStage(this.currentStageId);
      // ground 현재 스테이지 설정
      this.ground.setCurrStage(this.currentStageId);
    }
    // 스테이지 변경 알림을 보여주는 시간 - 1초
    setTimeout(() => {
      if (Math.floor(this.score) < nextStage?.score) {
        this.stageChange = true;
      }
    }, 1000);
  }

  getItem(itemId) {
    this.itemGetSound.play();
    const item = this.itemData.find((item) => item.id == itemId);
    this.score += item.score || 0;
    // 아이템 획득 이벤트
    if (item) sendEvent(12, { timestamp: Date.now(), itemId: itemId });
  }

  reset() {
    this.score = 0;
    this.currentStageId = FIRST_STAGE_ID;
  }

  setHighScore() {
    if (this.score > this.highScore) this.highScore = this.score;
  }

  getScore() {
    return this.score;
  }

  draw() {
    const stage = this.currentStageId - 999;
    const highScore = Math.floor(this.highScore);
    const y = 20 * this.scaleRatio;

    const fontSize = 24 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = 'white';

    const scoreX = this.canvas.width - 100 * this.scaleRatio;
    const highScoreX = scoreX - 150 * this.scaleRatio;
    const stageX = highScoreX - 150 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);
    const stagePadded = stage.toString().padStart(1, 1);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
    this.ctx.fillText(`STAGE ${stagePadded}`, stageX, y);
  }
}

export default Score;
