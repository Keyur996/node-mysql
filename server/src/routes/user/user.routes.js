"use strict";

const express = require("express");
const userController = require("./user.controller");
const authController = require("./auth.controller");

const router = express.Router();

router.route("/signup").post(authController.signUp);
router.route("/login").post(authController.logIn);

module.exports = router;
