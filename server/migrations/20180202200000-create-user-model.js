module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
        type: Sequelize.INTEGER,
        references: {
          model: 'meetings',
          key: 'id',
        },
      },
      name: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      onlinewebId: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      registerDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      canVote: {
        // DEFAULT false
        type: Sequelize.BOOLEAN,
      },
      notes: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      permissions: {
        type: Sequelize.SMALLINT,
      },
      completedRegistration: {
        // DEFAULT false
        type: Sequelize.BOOLEAN,
      },
    }).then(() => {
      queryInterface.createTable('anonymousUsers', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
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
          type: Sequelize.INTEGER,
          references: {
            model: 'meetings',
            key: 'id',
          },
        },
        passwordHash: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
      }).catch((err) => { throw err; });
    }).catch((err) => { throw err; });
    // return Promise.all(user, anonUser);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users').then(() => {
      return queryInterface.dropTable('anonymousUsers');
    });
  }
};