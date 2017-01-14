/* global: io */
const socket = io.connect('http://localhost:3000');
socket.on('connection', () => {});
socket.on('meeting', (data) => {
  let title = 'Ingen aktiv generalforsamling.';

  if (data && data.title) {
    title = data.title;
  }
  document.getElementById('meeting-title').innerHTML = title;

  socket.emit('my other event', { my: 'data' });
  const node = document.createElement('p');
  node.innerHTML = title;
  document.getElementById('log').appendChild(node);
});
