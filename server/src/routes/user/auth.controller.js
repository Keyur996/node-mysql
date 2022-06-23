"use strict";

const db = require("./../../models");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ErrorResponse = require("./../../helpers/error");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("../../config");

const logIn = asyncHandler(async (req, res, next) => {
   const { email, password } = req.body;
   if (!email || !password) {
      return next(new ErrorResponse("please provide email or password", 400));
   }

   const users = await db.User.findAll({ where: { email }, includes: ["children"] });
   const user = { ...users[0] };

   if (!user && !user.length) {
      return next(new ErrorResponse("user not Found", 404));
   }

   const isMatch = await comparePassword(password, user.password);

   if (!isMatch) {
      return next(new ErrorResponse("please enter valid password!!"));
   }

   //create jwt token and send
   createSendToken(user, res);
});

const signUp = async (req, res, next) => {
   let transcation = null;
   try {
      transcation = await db.sequelize.transaction();
      if (!req.body.password) {
         return next(new ErrorResponse("Please provide password", 404));
      }
      const hashPassword = await createHashPassword(req.body.password);
      const user = await db.User.create(
         {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            role: req.body.role,
            password: hashPassword,
         },
         { transcation: transcation }
      );
      await transcation.commit();
      createSendToken(user, res);
   } catch (err) {
      transcation && (await transcation.rollback());
      next(err);
   }
};

const logout = (req, res) => {
   res.cookie("jwt", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
   });
   res.status(200).json({ success: true });
};

const createSendToken = (user, res) => {
   const token = jwt.sign(
      { id: user.id },
      { secret: config.secret || "mydummySecret" },
      { expiresIn: "1d" }
   );

   res.cookie("jwt", token, {
      expires: new Date(Date.now() * 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: req.secure || req.headers["x-forwarded-proto"] === "https",
   });

   user.password = undefined;

   res.status(200).json({
      success: true,
      token,
      user,
   });
};

const comparePassword = async (password, hash) => {
   return bcrypt.compare(password, hash);
};

const createHashPassword = async (password) => {
   return bcrypt.hash(password, 12);
};

module.exports = {
   logIn,
   signUp,
   logout,
};
