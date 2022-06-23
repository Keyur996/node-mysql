"use strict";

const express = require("express");
require("express-async-errors");
const cors = require("cors");
const morgan = require("morgan");
const hpp = require("hpp");
const xss = require("xss-clean");
const helmet = require("helmet");
const errorHandler = require("./middlewares/error-handler");
const setRoutes = require("./routes");
const cookieParser = require("cookie-parser");

const app = express();

// Allow cross origin
app.use(cors());
// log req
app.use(morgan("dev"));
// prevent pollution in query params
app.use(hpp());
// prevent xss-attacks
app.use(xss());
// set security headers
app.use(helmet());
// set query and body
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

setRoutes(app);

app.use(errorHandler);

module.exports = app;
