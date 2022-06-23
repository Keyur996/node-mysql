"use strict";

const db = require("./../../../models");
const _ = require("lodash");

exports.createMany = async (children, transaction) => {
   const options = {};
   if (transaction) {
      options["transaction"] = transaction;
   }
   return db.Child.bulkCreate(children, options);
};

exports.deleteMany = async (children, transaction) => {
   const childrenIds = _.map(children, (_child) => _child.id);
   const query = {
      where: { id: childrenIds },
   };
   if (transaction) {
      query["transaction"] = transaction;
   }
   return db.Child.destory(query);
};
