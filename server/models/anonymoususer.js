// This model is accessed through 'models/user.accessors.js'

async function AnonymousUser(sequelize, DataTypes) {
  const model = await sequelize.define('anonymoususer', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    passwordHash: DataTypes.TEXT,
  });

  model.associate = (models) => {
    models.anonymoususer.belongsTo(models.meeting, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return model;
}

module.exports = AnonymousUser;
