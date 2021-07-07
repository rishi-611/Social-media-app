const express = require("express");
const auth = require("../middleware/auth");
const User = require("../db/models/User");

const authRouter = express.Router();

// all routes that require authentication

// get user by id

module.exports = authRouter;
