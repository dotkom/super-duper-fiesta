async function Question(sequelize, DataTypes) {
  const model = await sequelize.define('issue', {
    description: DataTypes.TEXT,
    date: DataTypes.DATE,
    active: DataTypes.BOOLEAN,
    deleted: DataTypes.BOOLEAN,
    secret: DataTypes.BOOLEAN,
    showOnlyWinner: DataTypes.BOOLEAN,
    countingBlankVotes: DataTypes.BOOLEAN,
    // voteDemand: Either "regular" or "qualified".
    voteDemand: DataTypes.STRING,
    qualifiedVoters: DataTypes.SMALLINT,
    currentVotes: DataTypes.SMALLINT,
    result: DataTypes.BOOLEAN,
    // status types: NOT_STARTED, IN_PROGRESS, FINISHED
    status: DataTypes.TEXT,
  });

  model.associate = (models) => {
    models.issue.belongsTo(models.meeting, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });
    models.issue.hasMany(models.alternative);
  };

  return model;
}

module.exports = Question;
