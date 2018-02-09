async function Alternative(sequelize, DataTypes) {
  const model = await sequelize.define('alternative', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  model.associate = models =>
    models.alternative.belongsTo(models.issue, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });

  return model;
}

module.exports = Alternative;
