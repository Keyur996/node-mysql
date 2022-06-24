"use strict";

const start = async () => {
   process.on("uncaughtException", (err) => {
      console.log("UNCAUGHT EXCEPTION Shutting Down server...");
      console.log(err.name, err.message);
      process.exit(1);
   });

   const app = require("./app");
   const config = require("./config");
   const dbConnect = require("./helpers/dbConnect");
   const db = require("./models");

   await dbConnect();
   // development purpose
   // await db.sequelize.sync({ force: true });
   await db.sequelize.sync();

   const port = config.port || 3000;
   const server = app.listen(port, () => {
      console.log(`Server is running on ${port}`);
   });

   process.on("unhandledRejection", (err) => {
      console.log("UNHANDLED REJECTION ERROR. Shutting Down ...");
      console.log(err.name, err.message);
      server.close(() => {
         process.exit(1);
      });
   });

   process.on("SIGTERM", (err) => {
      console.log("SIGTERN. Shutting Down server gracefully...");
      console.log(err.name, err.message);
      server.close(() => {
         process.exit(1);
      });
   });
};

module.exports = start;
