"use strict";

const userRoutes = require("./user/user.routes");

const setRoutes = (app) => {
   app.use("/api/user", userRoutes);
   app.get("/api/hello", (req, res) => {
      res.status(200).json({
         message: "Hello from Server",
      });
   });
};

module.exports = setRoutes;
