"use strict";

const express = require("express");
const userController = require("./user.controller");
const { protect, authorizeRole } = require("./../../middlewares/check-auth");

const router = express.Router();

router.route("").get(protect, authorizeRole('Admin'), userController.getUsers)

router.route("/:id")
    .patch(protect, authorizeRole('Admin'), userController.updateUser)
    .delete(protect, authorizeRole('Admin'), userController.deleteUser);

module.exports = router;
