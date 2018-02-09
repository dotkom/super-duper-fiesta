async function Genfors(sequelize, DataTypes) {
  const model = await sequelize.define('meeting', {
    title: DataTypes.STRING,
    date: DataTypes.DATE,
    registrationOpen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM('open', 'closed'),
      defaultValue: 'open',
    },
    pin: DataTypes.SMALLINT,
  });
  return model;
}

module.exports = Genfors;
