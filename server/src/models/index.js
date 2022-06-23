"use strict";

const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");
const config = require("../config");

const { user, password, database } = config.database;
const sequelize = new Sequelize(database, user, password, { dialect: "mysql" });

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require("./user.model")(sequelize);
db.Child = require("./child.model")(sequelize);

db.User.hasMany(db.Child, { as: "children" });
db.Child.belongsTo(db.User, {
   foreignKey: "userId",
   as: "user",
});
module.exports = db;
