import { sendEvent } from './Socket.js';

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  currentStageId = 1000;

  constructor(ctx, scaleRatio, stageData) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.stageData = stageData;
  }

  update(deltaTime) {
    // 스테이지 데이터 데이블
    const stages = this.stageData;
    // 현재 스테이지 정보
    const currStage = stages.filter((stage) => stage.id === this.currentStageId);
    const nextStage = stages.filter((stage) => stage.id === this.currentStageId + 1);

    this.score += currStage[0].scorePerSecond * deltaTime * 0.01;
    // 점수가 100점 이상이 될 시 서버에 메세지 전송
    if (this.score >= nextStage[0]?.score) {
      // 메시지
    }
    // 다음 스테이지 필요 점수에 도달시 다음 스테이지로 이동
    if (Math.floor(this.score) >= nextStage[0]?.score && this.stageChange) {
      this.stageChange = false;
      sendEvent(11, { currentStage: currStage[0].id, targetStage: nextStage[0].id });
      this.currentStageId = nextStage[0].id;
    }

    if (Math.floor(this.score) < nextStage[0]?.score) {
      this.stageChange = true;
    }
  }

  getItem(itemId) {
    this.score += 0;
  }

  reset() {
    this.score = 0;
    this.currentStageId = 1000;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
