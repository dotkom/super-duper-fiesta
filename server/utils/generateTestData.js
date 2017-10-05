const generateIssue = data => (Object.assign({
  _id: 1,
  active: true,
  genfors: '1',
  description: 'Description goes here',
}, data));

const generateSocket = (user = {}, cookie = {}) => ({
  request: {
    user: Object.assign({
      _id: '123',
      onlinewebId: '123',
      name: 'Namy',
      completedRegistration: false,
      permissions: 5,
      genfors: '1',
    }, user),
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

module.exports = {
  generateIssue,
  generateSocket,
  generateGenfors,
  generateAnonymousUser,
};
