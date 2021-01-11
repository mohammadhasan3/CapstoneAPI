"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Relations
// A profile must have one user only (one-to-one)
db.Profile.hasOne(db.User, {
  foreignKey: "profileId",
  allowNull: false,
});
db.User.belongsTo(db.Profile, {
  foreignKey: "profileId",
});

//User has many events - an event belongs to one user
db.User.hasMany(db.Event, {
  as: "events",
  foreignKey: { fieldName: "userId", allowNull: false },
});
db.Event.belongsTo(db.User, { as: "user" });

//User has many to many relationship with itself (Friends)
db.User.belongsToMany(db.User, {
  as: "user 1",
  through: db.Friend,
  foreignKey: "user1Id",
  unique: true,
});
db.User.belongsToMany(db.User, {
  as: "user 2",
  through: db.Friend,
  foreignKey: "user2Id",
  unique: true,
});

module.exports = db;
