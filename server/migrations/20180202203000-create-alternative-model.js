module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('alternatives', {
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
      text: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      issueId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'issues',
          key: 'id'
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('alternatives');
  }
};