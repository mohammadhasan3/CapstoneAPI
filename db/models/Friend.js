module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define("Friend", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
    },

    actionUser: {
      type: DataTypes.INTEGER,
    },
  });
  return Friend;
};
