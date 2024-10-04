import Enemy from './enemy.js';

class EnemyController {
  CACTUS_INTERVAL_MIN = 500;
  CACTUS_INTERVAL_MAX = 2000;

  nextEnemyInterval = null;
  enemy = [];

  constructor(ctx, enemyImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.enemyImages = enemyImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextEnemyTime();
  }

  setNextEnemyTime() {
    this.nextEnemyInterval = this.getRandomNumber(
      this.CACTUS_INTERVAL_MIN,
      this.CACTUS_INTERVAL_MAX,
    );
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createEnemy() {
    const index = this.getRandomNumber(0, this.enemyImages.length - 1);
    const enemyImage = this.enemyImages[index];
    const x = this.canvas.width * 1.5;
    const y = this.canvas.height - enemyImage.height;

    const enemy = new Enemy(this.ctx, x, y, enemyImage.width, enemyImage.height, enemyImage.image);

    this.enemy.push(enemy);
  }

  update(gameSpeed, deltaTime) {
    if (this.nextEnemyInterval <= 0) {
      // 선인장 생성
      this.createEnemy();
      this.setNextEnemyTime();
    }

    this.nextEnemyInterval -= deltaTime;

    this.enemy.forEach((enemy) => {
      enemy.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    // 지나간 선인장 삭제
    this.enemy = this.enemy.filter((enemy) => enemy.x > -enemy.width);
  }

  draw() {
    this.enemy.forEach((enemy) => enemy.draw());
  }

  collideWith(sprite) {
    return this.enemy.some((enemy) => enemy.collideWith(sprite));
  }

  reset() {
    this.enemy = [];
  }
}

export default EnemyController;
