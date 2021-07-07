const express = require("express");

const authRouter = express.Router();

authRouter.get("/", (req, res) => {
  res.send("authRouter working");
});

module.exports = authRouter;
