const express = require("express");

const profileRouter = express.Router();

profileRouter.get("/", (req, res) => {
  res.send("profileRouter working");
});

module.exports = profileRouter;
