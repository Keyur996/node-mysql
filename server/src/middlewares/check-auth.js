"use strict";

const asyncHandler = require("express-async-handler");
const ErrorResponse = require("./../helpers/error");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const config = require("./../config");
const db = require("./../models");
const _ = require("lodash");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(' ')[1];
    } else if(req.cookies.jwt) {    
        token = req.cookies.jwt;
    }

    if(!token) {
        return next(new ErrorResponse("You are not Logged in, Please login to get access!", 400));
    }

    const decodedToken = await decodeToken(token);

    const users = await db.User.findByPk(decodedToken.id, { include: ["children"] });

    if(!users) {
        return next(new ErrorResponse("The user belonging to this token does no longer exist.", 401));
    }
    
    req.currentUser = _.cloneDeep(users.dataValues);

    next();
});

const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if(roles.includes(req.currentUser.role) || _.get(req, 'params.id', '') === req.currentUser.id) {
            return next();
        }
        return next(new ErrorResponse("You do not have permission to perform this action", 403));
    }
} 

const decodeToken = async (token) => {
    return promisify(jwt.verify)(token, config.secret || 'mydummySecret');
}

module.exports = {
    protect,
    authorizeRole
}