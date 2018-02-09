module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('alternatives', {
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
      text: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      issueId: {
        type: Sequelize.INTEGER,
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