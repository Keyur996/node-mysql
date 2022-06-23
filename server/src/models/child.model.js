"use strict";

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
   const Child = sequelize.define("child", {
      name: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      age: {
         type: DataTypes.INTEGER,
         allowNull: false,
         validate: {
            max: 100,
         },
      },
   });

   return Child;
};
