async function User(sequelize, DataTypes) {
  const model = await sequelize.define('user', {
    name: DataTypes.TEXT,
    onlinewebId: DataTypes.TEXT,
    registerDate: DataTypes.DATE,
    canVote: DataTypes.BOOLEAN,
    notes: DataTypes.TEXT,
    permissions: DataTypes.SMALLINT,
    completedRegistration: DataTypes.BOOLEAN,
  });

  model.associate = (models) => {
    models.user.belongsTo(models.meeting, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return model;
}

module.exports = User;
