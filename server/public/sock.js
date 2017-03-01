/* global: io */
const socket = io.connect('http://localhost:3000');

let activeIssue = null;

const emit = (channel, data, metadata) => {
  // Merge any additional metadata with data we send in every request,
  // then add the actual payload in the `data` property.
  const obj = Object.assign({
    user: localStorage.getItem('userid'), // Uses react states in prod
  }, metadata);
  obj.data = data;
  socket.emit(channel, obj);
};

const addToLog = (type, message) => {
  const node = document.createElement('p');
  node.innerHTML = type + ': ' + message;
  document.getElementById('log').appendChild(node);
}

socket.on('connection', () => {});
socket.on('meeting', (data) => {
  let title = 'Ingen aktiv generalforsamling.';

  if (data && data.title) {
    title = data.title;
  }
  document.getElementById('meeting-title').innerHTML = title;

  // addToLog('G', title); might not be so relevant to log genfors change atm
});

document.getElementById('btn-open').addEventListener('click', (e) => {
  console.log('emitting issue open thingy');
  const issue = {
    description: 'Mitt spørsmål',
    secret: false,
    showOnlyWinner: false,
    countingBlankVotes: false,
    voteDemand: 0.5,
  };
  emit('issue', issue, { action: 'open' });
})

document.getElementById('btn-close').addEventListener('click', (e) => {
  console.log('emitting issue close thingy');

  if (activeIssue) {
    emit('issue', activeIssue, { type: 'close' });
  } else {
    console.error('no active question found');
  }
})

socket.on('public', (data) => {
  console.log('public', data);
});

socket.on('private', (data) => {
  console.log('priv', data);
});

socket.on('issue', (data) => {
  console.log('issue', data);
  const issue = data.data;
  let issueDescription = 'Ingen aktiv sak for øyeblikket.';
  if (issue && issue.active && issue.description) {
    activeIssue = issue;
    issueDescription = activeIssue.description;
  }
  if (!data.error) {
    document.getElementById('issue').innerHTML = issueDescription;
    addToLog('Q', issueDescription);
  }

  if (data.type === 'close') {
    activeIssue = null;
    document.getElementById('issue').innerHTML = 'Ingen aktiv sak for øyeblikket.';
    return;
  }
});
