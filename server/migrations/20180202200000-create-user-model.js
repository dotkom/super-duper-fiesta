module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('users', {
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
        // We need to allow this to be NULL because otherwise
        // you cannot log in without a genfors to create a genfors
        allowNull: true,
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
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      notes: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      permissions: {
        defaultValue: 0,
        type: Sequelize.SMALLINT,
      },
      completedRegistration: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
    }).then(() => {
      queryInterface.createTable('anonymoususers', {
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
      return queryInterface.dropTable('anonymoususers');
    });
  }
};