"use strict";

const db = require("./../../models");
const _ = require("lodash");
const childController = require("./child/child.controller");

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
      const user = await db.User.update(userObjUpdate, {
         where: { id: req.params.id },
         transaction: transaction,
      });

      if (req.body.childrens) {
         const bodyChildren = _.map(req.body.childrens || [], (_child) => {
            _child["userId"] = user.id;
            return _child;
         });

         await childController.deleteMany(bodyChildren, transaction);
         const children = await childController.createMany(bodyChildren, transaction);
         user["children"] = _.cloneDeep(children.defaultValues || bodyChildren);
      }

      return res.status(200).json({
         success: true,
         user,
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
                  promise.push(childController.deleteMany(children));
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

module.exports = {
   createUser,
};
