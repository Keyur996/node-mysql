"use strict";

const env = process.env.NODE_ENV || "development";

try {
   module.exports = require(`./env/${env}.js`);
} catch (err) {
   console.log("Kindly check file name or env name");
   module.exports = require("./env/development");
}
