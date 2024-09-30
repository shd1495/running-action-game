const users = [];

// 유저 접속 시
export const addUser = (user) => {
  users.push(user);
};

// 유저 접속 해제시
export const removeUser = (socketId) => {
  const idx = users.findIndex((user) => user.socketId === socketId);
  if (idx !== -1) return users.splice(idx, 1)[0];
};

export const getUser = () => {
  return users;
};
