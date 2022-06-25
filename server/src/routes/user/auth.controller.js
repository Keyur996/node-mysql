"use strict";

const db = require("./../../models");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ErrorResponse = require("./../../helpers/error");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const ms = require("ms");

const logIn = asyncHandler(async (req, res, next) => {
   const { email, password } = req.body;
   if (!email || !password) {
      return next(new ErrorResponse("please provide email or password", 400));
   }

   const user = await db.User.findOne({ where: { email }, include: ["children"] });

   if (!user) {
      return next(new ErrorResponse("User not Found", 404));
   }

   const isMatch = await comparePassword(password, user.password);

   if (!isMatch) {
      return next(new ErrorResponse("please enter valid password!!", 400));
   }

   //create jwt token and send
   createSendToken(user.dataValues, res, req);
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
         { transaction: transcation }
      );

      await transcation.commit();
      createSendToken(user, res, req);
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

const createSendToken = (user, res, req) => {
   const token = jwt.sign({ id: user.id }, config.secret || "mydummySecret", {
      expiresIn: "1d",
   });

   const expiresIn = ms("1d") / 1000;
   res.cookie("jwt", token, {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: req.secure || req.headers["x-forwarded-proto"] === "https",
   });

   user.password = undefined;

   res.status(200).json({
      success: true,
      token,
      expiresIn,
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
