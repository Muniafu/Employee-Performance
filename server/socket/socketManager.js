let ioInstance = null;

const onlineUsers = new Map();

const setIO = (io) => {
  ioInstance = io;
};

const getIO = () => {
  if (!ioInstance) {
    throw new Error(
      'Socket.IO not initialized.'
    );
  }

  return ioInstance;
};

const addUserSocket = (userId, socketId) => {

    const key = userId.toString();

    if (!onlineUsers.has(key)) {
        onlineUsers.set(key, new Set());
    }

    onlineUsers.get(key).add(socketId);

};

const removeUserSocket = (userId, socketId) => {

    const key = userId.toString();

    if (!onlineUsers.has(key)) return;

    const sockets = onlineUsers.get(key);

    sockets.delete(socketId);

    if (sockets.size === 0) {
        onlineUsers.delete(key);
    }

};

const getUserSockets = (userId) => {

    const sockets =
        onlineUsers.get(userId.toString());

    return sockets
        ? [...sockets]
        : [];

};

module.exports = {
  setIO,
  getIO,
  onlineUsers,
  addUserSocket,
  removeUserSocket,
  getUserSockets,
};