"use strict";

const userRoutes = require("./user/user.routes");
const authController = require("./user/auth.controller");

const setRoutes = (app) => {
   // Auth Routes
   app.post("/api/login", authController.logIn);
   app.post("/api/signup", authController.signUp);
   app.get("/api/logout", authController.logout);
   // User routes
   app.use("/api/user", userRoutes);
   // Test Route
   app.get("/api/hello", (req, res) => {
      res.status(200).json({
         message: "Hello from Server",
      });
   });
};

module.exports = setRoutes;
