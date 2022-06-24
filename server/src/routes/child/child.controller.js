"use strict";

const db = require("../../models");
const _ = require("lodash");

exports.createMany = async (children, transaction) => {
   const options = {};
   if (transaction) {
      options["transaction"] = transaction;
   }
   return db.Child.bulkCreate(children, options);
};

exports.deleteManyByUserId = async (userId, transaction) => {
   const query = {
      where: { userId: userId },
   };
   if (transaction) {
      query["transaction"] = transaction;
   }
   return db.Child.destroy(query);
};
