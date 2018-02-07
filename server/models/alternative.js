async function Alternative(sequelize, DataTypes) {
  const model = await sequelize.define('alternative', {
    text: DataTypes.TEXT,
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
