const db = require('./postgresql');

const Alternative = db.sequelize.models.alternative;


async function addAlternative(data) {
  return Alternative.create(data);
}

module.exports = {
  addAlternative,
};
