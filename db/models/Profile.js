module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define("Profile", {
    image: {
      type: DataTypes.STRING,
      defaultValue:
        "https://t4.ftcdn.net/jpg/03/46/93/61/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM.jpg",
    },
    bio: {
      type: DataTypes.STRING,
      defaultValue: "Welcome to my profile fellow Tripster!",
    },
  });
  return Profile;
};
