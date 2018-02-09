const { VOTING_NOT_STARTED, VOTING_IN_PROGRESS, VOTING_FINISHED } = require('../../common/actionTypes/issues');
const { RESOLUTION_TYPES } = require('../../common/actionTypes/voting');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('issues', {
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
      meetingId: {
        type: Sequelize.UUID,
        references: {
          model: 'meetings',
          key: 'id'
        }
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      active: {
        defaultValue: true,
        type: Sequelize.BOOLEAN
      },
      deleted: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      secret: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      showOnlyWinner: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      countingBlankVotes: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      voteDemand: {
        defaultValue: RESOLUTION_TYPES.regular.key,
        type: Sequelize.ENUM(...Object.keys(RESOLUTION_TYPES)),
      },
      qualifiedVoters: {
        allowNull: true,
        type: Sequelize.SMALLINT
      },
      currentVotes: {
        allowNull: true,
        type: Sequelize.SMALLINT
      },
      result: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      status: {
        allowNull: false,
        defaultValue: VOTING_NOT_STARTED,
        type: Sequelize.ENUM(VOTING_NOT_STARTED, VOTING_IN_PROGRESS, VOTING_FINISHED),
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    // DROP RELATION
    return queryInterface.dropTable('issues');
  }
};