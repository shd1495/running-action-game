import { FIRST_STAGE_ID } from './Constants.js';

class Ground {
  static instance = null;
  currentStage = FIRST_STAGE_ID;

  constructor(ctx, width, height, speed, scaleRatio, stageData) {
    if (Ground.instance) {
      return Ground.instance; // 이미 인스턴스가 있다면 그 인스턴스를 반환
    }
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.scaleRatio = scaleRatio;
    this.stageData = stageData;

    this.x = 0;
    this.y = this.canvas.height - this.height;

    this.groundImage = new Image();
    this.setCurrStage(FIRST_STAGE_ID); // 초기 스테이지 설정

    Ground.instance = this;
  }

  setCurrStage(stage) {
    this.currentStage = stage;
    // 스테이지별 배경 설정
    const stageTable = this.stageData.find((stage) => this.currentStage === stage.id);
    this.groundImage.src = stageTable.background;
  }

  update(gameSpeed, deltaTime) {
    this.x -= gameSpeed * deltaTime * this.speed * this.scaleRatio;
  }

  draw() {
    this.ctx.drawImage(this.groundImage, this.x, this.y, this.width, this.height);

    this.ctx.drawImage(
      this.groundImage,
      // 2개 연결
      this.x + this.width - 1,
      this.y,
      this.width,
      this.height,
    );

    // 땅이 끝났을 때 처음으로
    if (this.x < -this.width) {
      this.x = 0;
    }
  }

  reset() {
    this.x = 0;
  }
}

export default Ground;
