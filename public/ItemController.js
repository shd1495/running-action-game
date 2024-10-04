import Item from './Item.js';
import { FIRST_STAGE_ID } from './Constants.js';

class ItemController {
  static instance = null;
  INTERVAL = 3000;

  nextInterval = null;
  items = [];
  currentStage = FIRST_STAGE_ID;

  constructor(ctx, itemImages, scaleRatio, speed, itemUnlockData) {
    if (ItemController.instance) {
      return ItemController.instance; // 이미 인스턴스가 있다면 그 인스턴스를 반환
    }
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;
    this.itemUnlockData = itemUnlockData;

    this.setNextItemTime();
    ItemController.instance = this;
  }

  setNextItemTime() {
    this.nextInterval = this.INTERVAL;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createItem() {
    // 스테이지별 아이템 생성
    const itemTable = this.itemUnlockData.find((item) => this.currentStage === item.stageId);
    const index = this.getRandomNumber(0, itemTable?.itemId.length - 1);
    const itemInfo = this.itemImages[index];
    console.log(this.currentStage);
    console.log('itemTable: ', itemTable);
    console.log('index:', index);
    console.log('itemInfo:', itemInfo);
    const x = this.canvas.width * 1.5;
    const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

    const item = new Item(
      this.ctx,
      itemInfo.id,
      x,
      y,
      itemInfo.width,
      itemInfo.height,
      itemInfo.image,
    );

    this.items.push(item);
  }

  setCurrStage(stage) {
    this.currentStage = stage;
  }

  update(gameSpeed, deltaTime) {
    if (this.nextInterval <= 0) {
      this.createItem();
      this.setNextItemTime();
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
      return {
        itemId: collidedItem.id,
      };
    }
  }

  reset() {
    this.items = [];
    this.currentStage = FIRST_STAGE_ID;
  }
}

export default ItemController;
