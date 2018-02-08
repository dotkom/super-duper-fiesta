async function User(sequelize, DataTypes) {
  const model = await sequelize.define('user', {
    name: DataTypes.TEXT,
    onlinewebId: DataTypes.TEXT,
    registerDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    canVote: DataTypes.BOOLEAN,
    notes: DataTypes.TEXT,
    permissions: DataTypes.SMALLINT,
    completedRegistration: DataTypes.BOOLEAN,
  });

  model.associate = (models) => {
    models.user.belongsTo(models.meeting, {
      onDelete: 'CASCADE',
      foreignKey: {
        // We need to allow this to be NULL because otherwise
        // you cannot log in without a genfors to create a genfors
        allowNull: true,
      },
    });
  };

  return model;
}

module.exports = User;
