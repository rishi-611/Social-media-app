const express = require("express");
const auth = require("../middleware/auth");
const User = require("../db/models/User");

const authRouter = express.Router();

module.exports = authRouter;
