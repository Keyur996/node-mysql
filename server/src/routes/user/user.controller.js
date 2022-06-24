"use strict";

const db = require("./../../models");
const _ = require("lodash");
const childController = require("./../child/child.controller");
const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");

exports.updateUser = async (req, res, next) => {
   let transaction = null;
   try {
      const userObjUpdate = {
         name: req.body.name,
         email: req.body.email,
         phone: req.body.phone,
         role: req.body.role,
      };
      transaction = await db.sequelize.transaction();
      await db.User.update(userObjUpdate, {
         where: { id: req.params.id },
         transaction: transaction
      });

      if (req.body.children) {
         const bodyChildren = _.map(req.body.children || [], (_child) => {
            _child["userId"] = req.params.id;
            return _child;
         });

         await childController.deleteManyByUserId(req.params.id, transaction);
         await childController.createMany(bodyChildren, transaction);
      }

      const userTosend = await db.User.findByPk(req.params.id, { include: ["children"], transaction });
      await transaction.commit();
      return res.status(200).json({
         success: true,
         user: userTosend,
      });
   } catch (err) {
      transaction && (await transaction.rollback());
      next(err);
   }
};

exports.deleteUser = async (req, res, next) => {
   try {
      const query = {
         where: { id: req.params.id },
         includes: ["children"],
         raw: true,
         nest: true,
      };
      const users = await db.User.findAll(query);

      await Promise.all(
         _.reduce(
            users || [],
            (promise, _user) => {
               promise.push(db.User.destroy({ where: { id: req.params.id } }));
               if (_user.children && _user.children.length) {
                  promise.push(childController.deleteManyByUserId(req.params.id));
               }
               return promise;
            },
            []
         )
      );

      return res.status(200).json({
         success: true,
         data: null,
      });
   } catch (err) {
      next(err);
   }
};

exports.getUsers = asyncHandler(async (req, res, next) => {

   const { page, size, name } = req.query;
   const condition = name ?  { name: { [Op.like]:`%${name}%`} } : null;
   const { limit, offset } = getPagination(page, size);

   const { count,  rows: users } = await db.User.findAndCountAll({ where: condition, limit: limit, offset: offset });

   res.status(200).json({
      success: true,
      count,
      users
   })
});

const getPagination = (page, size) => {
   const limit = size ? +size : 2;
   const offset = page ? (page - 1) * limit : 0;

   return { limit, offset };
} 