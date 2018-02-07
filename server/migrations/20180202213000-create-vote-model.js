module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('votes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      issueId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'issues',
          key: 'id',
        },
      },
      alternativeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'alternatives',
          key: 'id',
        },
      },
      userId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      anonymoususerId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'anonymoususers',
          key: 'id',
        },
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('votes');
  }
};