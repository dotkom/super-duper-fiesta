const generateIssue = data => (Object.assign({
  _id: 1,
  active: true,
  genfors: '1',
  description: 'Description goes here',
}, data));

const generateUser = data => (Object.assign({
  _id: '123',
  onlinewebId: '123',
  name: 'Namy',
  completedRegistration: true,
  permissions: 5,
  genfors: '1',
  logged_in: true,
}, data));

const generateSocket = (user = {}, cookie = {}) => ({
  request: {
    user: generateUser(user),
    headers: {
      cookie: Object.assign({
        passwordHash: 'hashy',
      }, cookie),
    },
  },
});

const generateGenfors = data => (Object.assign({
  id: 1,
  registrationOpen: true,
  pin: 3141592653,
}, data));

const generateAnonymousUser = data => (Object.assign({
  passwordHash: 'secret_hash',
  genfors: 1,
}, data));

const generateVote = data => (Object.assign({
  _id: 0,
  issue: 1,
  user: 1,
  option: 3,
}, data));

module.exports = {
  generateIssue,
  generateSocket,
  generateGenfors,
  generateAnonymousUser,
  generateUser,
  generateVote,
};
