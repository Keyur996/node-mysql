"use strict";

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
   const User = sequelize.define("user", {
      email: {
         type: DataTypes.STRING,
         allowNull: false,
         unique: true,
      },
      name: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      phone: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      role: {
         type: DataTypes.ENUM("Admin", "User", "Manager"),
         allowNull: false,
         defaultValue: "User",
      },
      password: {
         type: DataTypes.STRING,
         allowNull: false,
      },
   });

   return User;
};
