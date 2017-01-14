const issue = (socket) => {
  if (socket.data.status === true) {
    // create issue
  }
  if (socket.data.status === false) {
    // closeIssue(socket.data)
  }
};

module.exports = issue;
