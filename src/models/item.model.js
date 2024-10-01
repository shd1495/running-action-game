const items = {};

export const clearItem = (uuid) => {
  items[uuid] = [];
};

export const setItem = (uuid, item) => {
  items[uuid].push(item);
};

export const getItemList = (uuid) => {
  return items[uuid];
};
