const { MEETING_STATUSES: meetingStates } = require('../../common/actionTypes/meeting');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('meetings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      registrationOpen: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM(...Object.keys(meetingStates)),
      },
      pin: {
        allowNull: true,
        type: Sequelize.SMALLINT
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Meetings');
  }
};