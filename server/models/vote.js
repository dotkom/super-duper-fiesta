async function Vote(sequelize, DataTypes) {
  const model = await sequelize.define('vote', {
  });

  model.associate = (models) => {
    models.vote.belongsTo(models.user, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: true,
      },
    });
    models.vote.belongsTo(models.anonymoususer, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: true,
      },
    });
    models.vote.belongsTo(models.issue, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });
    models.vote.belongsTo(models.alternative, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return model;
}

module.exports = Vote;
