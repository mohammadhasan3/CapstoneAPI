module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define("Event", {
    name: {
      type: DataTypes.STRING,
    },
    label: {
      type: DataTypes.TEXT,
    },
    date: {
      type: DataTypes.DATE,
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: null,
    },

    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Event;
};
