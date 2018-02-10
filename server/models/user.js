async function User(sequelize, DataTypes) {
  const model = await sequelize.define('user', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    onlinewebId: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    registerDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    canVote: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    permissions: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
    },
    completedRegistration: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
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
