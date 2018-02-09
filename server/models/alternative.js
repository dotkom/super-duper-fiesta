async function Alternative(sequelize, DataTypes) {
  const model = await sequelize.define('alternative', {
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
