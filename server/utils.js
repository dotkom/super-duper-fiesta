const mergePermanentAndMetadata = (perm, meta) => Object.assign(perm, meta);

const broadcast = (socket, channel, payload, metadata) => {
  const obj = mergePermanentAndMetadata({}, metadata);
  obj.data = payload;
  socket.broadcast.emit(channel, obj);
};

const emit = (socket, channel, payload, metadata) => {
  const obj = mergePermanentAndMetadata({}, metadata);
  obj.data = payload;
  socket.emit(channel, obj);
};

module.exports = {
  broadcast,
  emit,
};
