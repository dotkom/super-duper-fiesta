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

  console.log('emitting issue thingy');
  socket.emit('issue', { action: 'open', title: 'Mitt spørsmål' });
  setTimeout(() => {
    socket.emit('issue', { action: 'close', title: 'Mitt spørsmål' });
  }, 10000);
});

socket.on('public', (data) => {
  console.log('public', data);
});

socket.on('private', (data) => {
  console.log('priv', data);
});

socket.on('issue', (data) => {
  console.log('issue', data);
  let question = 'Ingen aktiv sak for øyeblikket.';
  if (data && data.title && data.action !== 'close') {
    question = data.title;
  }
  document.getElementById('question').innerHTML = question;
});
