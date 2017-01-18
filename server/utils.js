const mergePermanentAndMetadata = (perm, meta) => Object.assign(perm, meta);

const broadcast = (socket, channel, payload, metadata) => {
  const obj = mergePermanentAndMetadata({
    type: channel,
  }, metadata);
  obj.data = payload;
  socket.broadcast.emit('action', obj);
};

const emit = (socket, channel, payload, metadata) => {
  const obj = mergePermanentAndMetadata({
    type: channel,
  }, metadata);
  obj.data = payload;
  socket.emit('action', obj);
};

module.exports = {
  broadcast,
  emit,
};
