"use strict";

const mysql = require("mysql2/promise");
const config = require("../config");

const dbConnect = async () => {
   try {
      const { host, port, user, password, database } = config.database;
      const connection = await mysql.createConnection({ host, port, user, password });

      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
   } catch (err) {
      console.log("Something Went Wrong!", err);
   }
};

module.exports = dbConnect;
