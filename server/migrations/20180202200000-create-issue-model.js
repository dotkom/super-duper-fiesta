module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('issues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      genforsId: {
        // FK to Genfors
        // type: Sequelize.FOREIGNKEY,
        // to: GENFORS
        type: Sequelize.INTEGER,
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
        // Default: true
        type: Sequelize.BOOLEAN
      },
      deleted: {
        // Default: false
        type: Sequelize.BOOLEAN
      },
      secret: {
        // Default false
        type: Sequelize.BOOLEAN
      },
      showOnlyWinner: {
        // Default true
        type: Sequelize.BOOLEAN
      },
      countOnlyBlankVotes: {
        // Default true
        type: Sequelize.BOOLEAN
      },
      voteDemand: {
        // "regular" or "qualified"
        type: Sequelize.TEXT
      },
      qualifiedVoters: {
        type: Sequelize.SMALLINT
      },
      currentVotes: {
        type: Sequelize.SMALLINT
      },
      result: {
        // nullable
        type: Sequelize.BOOLEAN
      },
      status: {
        // NOT STARTED, IN PROGRESS, FINISHED
        allowNull: false,
        type: Sequelize.TEXT,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    // DROP RELATION
    return queryInterface.dropTable('issues');
  }
};