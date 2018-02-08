async function Genfors(sequelize, DataTypes) {
  const model = await sequelize.define('meeting', {
    title: DataTypes.STRING,
    date: DataTypes.DATE,
    registrationOpen: {
      type: DataTypes.BOOLEAN,
      defaultValeue: false,
    },
    status: {
      type: DataTypes.TEXT,
      defaultValue: 'open',
    },
    pin: DataTypes.SMALLINT,
  });
  return model;
}

module.exports = Genfors;
