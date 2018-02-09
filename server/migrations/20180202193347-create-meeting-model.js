module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('meetings', {
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
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      registrationOpen: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('open', 'closed'),
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