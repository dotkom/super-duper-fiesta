async function Genfors(sequelize, DataTypes) {
  const model = await sequelize.define('meeting', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    title: DataTypes.STRING,
    date: DataTypes.DATE,
    registrationOpen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM('open', 'closed'),
      defaultValue: 'open',
    },
    pin: {
      allowNull: true,
      type: DataTypes.SMALLINT,
    },
  });
  return model;
}

module.exports = Genfors;
