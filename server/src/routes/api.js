const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const planetsRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");

const api = express.Router();

api.use("/planets", planetsRouter);
api.use("/launches", launchesRouter);

module.exports = api;
