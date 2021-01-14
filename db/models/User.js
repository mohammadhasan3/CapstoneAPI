module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Username already exists",
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email already exists",
      },
    },

    friends: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      unique: {
        args: true,
        msg: "Cant have the same friend multiple times",
      },
    },

    blockedBy: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
  });
  return User;
};
