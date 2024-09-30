import fs from 'fs';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../assets');

// 파일 읽는 함수
// 비동기 병렬로 파일을 읽는다
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        rejects(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

// Promise.all() 비동기 병렬 처리
export const loadGameAssets = async () => {
  try {
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
    ]);

    gameAssets = { stages, items, itemUnlocks };
    return gameAssets;
  } catch (error) {
    throw new Error('assets 파일 로드에 실패했습니다.' + error.message);
  }
};

let gameAssets = {};

export const getGameAssets = () => {
  return gameAssets;
};
