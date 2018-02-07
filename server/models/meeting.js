async function Genfors(sequelize, DataTypes) {
  const model = await sequelize.define('meeting', {
    title: DataTypes.STRING,
    date: DataTypes.DATE,
    registrationOpen: DataTypes.BOOLEAN,
    status: DataTypes.TEXT,
    pin: DataTypes.SMALLINT,
  });
  return model;
}

module.exports = Genfors;
