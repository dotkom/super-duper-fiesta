const { VOTING_NOT_STARTED, VOTING_IN_PROGRESS, VOTING_FINISHED } = require('../../common/actionTypes/issues');
const { RESOLUTION_TYPES } = require('../../common/actionTypes/voting');

async function Question(sequelize, DataTypes) {
  const model = await sequelize.define('issue', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
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
    voteDemand: {
      defaultValue: RESOLUTION_TYPES.regular.key,
      type: DataTypes.ENUM(...Object.keys(RESOLUTION_TYPES)),
    },
    qualifiedVoters: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    currentVotes: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    result: DataTypes.BOOLEAN,
    status: {
      allowNull: false,
      type: DataTypes.ENUM(VOTING_NOT_STARTED, VOTING_IN_PROGRESS, VOTING_FINISHED),
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
