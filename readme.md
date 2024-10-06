# running-action-game
![메인](https://github.com/user-attachments/assets/df5b0760-227d-403e-a8b5-693ed0e72d10)
## 기술 스택
- Node.js - Express
  
- Redis cloud - ioredis
  
- Publish - AWS EC2
  
- PackageManager - Yarn

## 실행 방법
- [게임 플레이](http://shd1495.store:3030/)

## 필수

- [x] 스테이지 구분
- [x] 스테이지에 따른 점수 획득 구분
- [x] 스테이지에 따라 아이템이 생성
- [x] 아이템 획득 시 점수 획득
- [x] 아이템 별 획득 점수 구분

## 도전

- [x] Broadcast 기능 추가
- [x] 가장 높은 점수 Record 관리
- [x] 유저 정보 연결
- [x] Redis 연동, 게임 정보 저장

## 패킷 구조
[![pngwing com](https://github.com/user-attachments/assets/0b16d6ab-5527-4ff3-8201-a86b290ee0ed)](https://frosted-occupation-9b9.notion.site/running-action-game-1116a99984a1804d9555cae4e82746e4)
## 플레이어
### 점프
![player_jump (3)](https://github.com/user-attachments/assets/0cc9436e-6814-461b-b9e4-9b08a802a705)
- 점프 후 75밀리초 만큼 점프 쿨타임 존재
  -  jumpCoolTime: 75
  ```js
  COOL_TIME = 75;
  jumpCoolTime = 0;

  update()...
  this.jump(deltaTime);
  if (this.jumpCoolTime > 0) {
    this.jumpCoolTime -= deltaTime;
    if (this.jumpCoolTime < 0) this.jumpCoolTime = 0;
  }

  jump()...
  this.jumpCoolTime = this.COOL_TIME;
  ```

- 점프 후 떨어지는 속도가 점점 가속하도록 구현
  -  fallSpeed: 최대 6
  ```js
  JUMP_SPEED = 0.6;
  GRAVITY = 0.1;
  fallSpeed = 0;
  
  this.fallSpeed += this.GRAVITY * deltaTime * 0.2;
  this.fallSpeed = Math.min(this.fallSpeed, 6);
  this.y += this.fallSpeed * this.scaleRatio;
  ```

### 걷기
![player_run1 (2)](https://github.com/user-attachments/assets/06b55553-52af-48ca-a29d-319726b49115)
![player_run1 (1)](https://github.com/user-attachments/assets/5a5dda64-075b-47a3-8fa0-3aaf7d5422de)

### 게임오버
![player_die1-removebg-preview](https://github.com/user-attachments/assets/9a28ef48-911b-418d-af16-7f4d95ddb2d1)

## 스테이지 시스템
### 스테이지별 배경 및 점수
#### 1 스테이지 - 1초당 10점
![ground1](https://github.com/user-attachments/assets/26faaa60-acac-4888-a579-f0bf40d4a90d)

#### 2 스테이지 - 1초당 20점
![ground2](https://github.com/user-attachments/assets/4e9da9d8-1696-4a2e-a1fa-7587c39c5341)

#### 3 스테이지-  1초당 30점
![ground3](https://github.com/user-attachments/assets/9c8e92bb-303b-4547-ac32-87dd6b995994)

#### 4 스테이지-  1초당 40점
![ground4](https://github.com/user-attachments/assets/ef59a18f-b1e6-4df7-a38a-465b9117da7e)

#### 5 스테이지 - 1초당 60점
![ground5](https://github.com/user-attachments/assets/d4a9d836-c64f-41bd-9ddc-6caa9c5958ff)

#### 6 스테이지 - 1초당 80점
![ground6](https://github.com/user-attachments/assets/b022c147-7bcb-43c2-9f2e-cf9ab543d3ad)

#### 7 스테이지 - 1초당 100점
![ground7](https://github.com/user-attachments/assets/1392a881-c877-49a7-aec3-9f6af9eeb144)

## 아이템 시스템
### 아이템 목록 및 점수
- ![apple](https://github.com/user-attachments/assets/4c1f77fd-3bcf-409d-996a-fc33e75bd729) - 사과: 10점 / 1스테이지부터 등장
- ![tomato](https://github.com/user-attachments/assets/7b7dfcb5-e7d6-4ed6-9518-299626dac0e1) - 토마토: 25점 / 2스테이지부터 등장
- ![kiwi](https://github.com/user-attachments/assets/63b993dc-8fd1-491a-a702-b942588a3b5b) - 키위: 50점 / 3스테이지부터 등장
- ![watermelon](https://github.com/user-attachments/assets/39cb944b-b6c7-4db7-ba07-4a56a9386f7a) - 수박: 100점 / 4스테이지부터 등장
- ![honey](https://github.com/user-attachments/assets/506c17e4-2205-4254-a3f7-88c6ee542b3d) - 꿀: 150점 / 5스테이지부터 등장
- ![meet](https://github.com/user-attachments/assets/4549aed4-4f8c-4ad6-855f-37bb4e12aa22) - 고기: 250점 / 6스테이지부터 등장
- ![cake](https://github.com/user-attachments/assets/000303df-30a5-4fa6-96fa-759247b0c29c) - 케이크: 500점 / 7스테이지부터 등장

## 장애물 시스템
### 밴시
![banshee (1)](https://github.com/user-attachments/assets/0e6a820f-adb5-443a-96b9-2c4afe6cd704)

### 유령
![ghost (1)](https://github.com/user-attachments/assets/f47d9e2b-2699-4ef6-bc41-b55ec5524515)

### 해골
![skel (1)](https://github.com/user-attachments/assets/f3ac97ae-718c-4934-808c-ac439fad916f)

## Redis
### 유저 기록
- 최초 접속 시 유저의 uuid를 로컬 스토리지에 저장

- 접속 시 로컬 스토리지의 uuid 유무에 따라 uuidv4 발급 및 사용

- 접속 시 접속 중인 유저 목록에 유저 추가

- 접속 종료 시 접속 중인 유저 목록에서 유저 삭제
  
### 최고 기록
- 최고 점수 달성 시 모든 접속 중인 유저에게 브로드캐스트 및 최고 기록 업데이트

- 최고 점수를 기록한 유저의 uuid 및 점수를 저장

- 최고 기록을 보유 중인 유저가 접속 시 환영 메시지
