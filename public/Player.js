class Player {
  WALK_ANIMATION_TIMER = 200;
  walkAnimationTimer = this.WALK_ANIMATION_TIMER;
  playerRunImages = [];

  //점프 상태값
  jumpPressed = false;
  jumpInProgress = false;
  falling = false;

  JUMP_SPEED = 0.6;
  GRAVITY = 0.1;
  fallSpeed = 0;

  // 생성자
  constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.width = width;
    this.height = height;
    this.minJumpHeight = minJumpHeight;
    this.maxJumpHeight = maxJumpHeight;
    this.scaleRatio = scaleRatio;
    this.jumpSound = new Audio('./sounds/playerJump.wav');
    this.dieSound = new Audio('./sounds/playerDie.wav');

    this.x = 40 * scaleRatio;
    this.y = this.canvas.height - this.height - 1.5 * scaleRatio;
    // 기본 위치 상수화
    this.yStandingPosition = this.y;

    this.standingStillImage = new Image();
    this.standingStillImage.src = 'images/player_jump.png';
    this.image = this.standingStillImage;

    // 달리기
    const playerRunImage1 = new Image();
    playerRunImage1.src = 'images/player_run1.png';

    const playerRunImage2 = new Image();
    playerRunImage2.src = 'images/player_run2.png';

    // 게임오버 이미지
    this.playerDieImage = new Image();
    this.playerDieImage.src = 'images/player_die.png';

    this.playerRunImages.push(playerRunImage1);
    this.playerRunImages.push(playerRunImage2);

    // 키보드 설정
    // 등록된 이벤트가 있는 경우 삭제하고 다시 등록
    window.removeEventListener('keydown', this.keydown);
    window.removeEventListener('keyup', this.keyup);

    window.addEventListener('keydown', this.keydown);
    window.addEventListener('keyup', this.keyup);
  }

  keydown = (event) => {
    if (event.code === 'Space') {
      this.jumpPressed = true;
    }
  };

  keyup = (event) => {
    if (event.code === 'Space') {
      this.jumpPressed = false;
    }
  };

  update(gameSpeed, deltaTime) {
    this.run(gameSpeed, deltaTime);

    if (this.jumpInProgress) {
      this.image = this.standingStillImage;
    }

    this.jump(deltaTime);
  }

  jump(deltaTime) {
    if (this.jumpPressed && !this.jumpInProgress) {
      this.jumpSound.play();
      this.jumpInProgress = true;
    }

    // 점프가 진행중이고 떨어지는중이 아닐때
    if (this.jumpInProgress && !this.falling) {
      // 현재 인스턴스의 위치가 점프의 최소, 최대값의 사이일때
      if (
        this.y > this.canvas.height - this.minJumpHeight ||
        (this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed)
      ) {
        // 아무튼 위의 내용은 버튼을 눌렀을때 올라가는 조건
        this.y -= this.JUMP_SPEED * deltaTime * this.scaleRatio;
      } else {
        this.falling = true;
      }
      // 떨어질 때
    } else {
      if (this.y < this.yStandingPosition) {
        this.fallSpeed += this.GRAVITY * deltaTime * 0.3;
        console.log(this.fallSpeed);
        this.fallSpeed = Math.min(this.fallSpeed, 10);
        this.y += this.fallSpeed * this.scaleRatio;

        // 혹시 위치가 어긋 났을때 원래 위치로
        if (this.y + this.height > this.canvas.height) {
          this.y = this.yStandingPosition;
          this.fallSpeed = 0;
        }
      } else {
        this.falling = false;
        this.jumpInProgress = false;
        this.fallSpeed = 0;
      }
    }
  }

  run(gameSpeed, deltaTime) {
    if (this.walkAnimationTimer <= 0) {
      if (this.image === this.playerRunImages[0]) {
        this.image = this.playerRunImages[1];
      } else {
        this.image = this.playerRunImages[0];
      }
      this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    }

    this.walkAnimationTimer -= deltaTime * gameSpeed;
  }

  die() {
    this.image = this.playerDieImage;
    this.dieSound.play();
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

export default Player;
