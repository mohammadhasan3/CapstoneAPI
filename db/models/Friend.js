module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define("Friend", {
    status: {
      type: DataTypes.INTEGER,
    },

    actionUser: {
      type: DataTypes.INTEGER,
    },
  });
  return Friend;
};
