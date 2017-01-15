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
  const issue = {
    action: 'open',
    description: 'Mitt spørsmål',
    secret: false,
    showOnlyWinner: false,
    countingBlankVotes: false,
    voteDemand: null,
  };
  socket.emit('issue', issue);
  setTimeout(() => {
    issue.action = 'close';
    socket.emit('issue', issue);
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
  let issue = 'Ingen aktiv sak for øyeblikket.';
  if (data && data.description && data.action !== 'close') {
    issue = data.description;
  }
  document.getElementById('question').innerHTML = question;
});
