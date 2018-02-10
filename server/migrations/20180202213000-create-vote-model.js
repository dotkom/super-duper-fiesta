module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('votes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'issues',
          key: 'id',
        },
      },
      alternativeId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'alternatives',
          key: 'id',
        },
      },
      userId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      anonymoususerId: {
        allowNull: true,
        type: Sequelize.UUID,
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