const { VOTING_NOT_STARTED } = require('../../common/actionTypes/issues');

async function Question(sequelize, DataTypes) {
  const model = await sequelize.define('issue', {
    description: DataTypes.TEXT,
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    secret: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    showOnlyWinner: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    countingBlankVotes: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // voteDemand: Either "regular" or "qualified".
    voteDemand: DataTypes.STRING,
    qualifiedVoters: DataTypes.SMALLINT,
    currentVotes: DataTypes.SMALLINT,
    result: DataTypes.BOOLEAN,
    // status types: NOT_STARTED, IN_PROGRESS, FINISHED
    status: {
      type: DataTypes.TEXT,
      defaultValue: VOTING_NOT_STARTED,
    },
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
