const mergePermanentAndMetadata = (perm, meta) => Object.assign(perm, meta);

const createSocketObject = (channel, payload, metadata) => {
  const obj = mergePermanentAndMetadata({
    type: channel,
  }, metadata);
  obj.data = payload;
  return obj;
};

const broadcast = (socket, channel, payload, metadata) => {
  socket.broadcast.emit('action', createSocketObject(channel, payload, metadata));
};

const emit = (socket, channel, payload, metadata) => {
  socket.emit('action', createSocketObject(channel, payload, metadata));
};

const broadcastAndEmit = (socket, channel, payload, metadata) => {
  broadcast(socket, channel, payload, metadata);
  emit(socket, channel, payload, metadata);
};

const adminBroadcast = (socket, channel, payload, metadata) => {
  socket.to('admin').emit('action', createSocketObject(channel, payload, metadata));
};

module.exports = {
  broadcast,
  emit,
  broadcastAndEmit,
  adminBroadcast,
};
