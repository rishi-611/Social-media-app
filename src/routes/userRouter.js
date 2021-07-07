const express = require("express");

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("userRouter working");
});

module.exports = userRouter;
