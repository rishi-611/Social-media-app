const jwt = require("jsonwebtoken");
const User = require("../db/models/User");

const auth = async function (req, res, next) {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(404).json({
        errors: [
          {
            msg: "user not authorized",
          },
        ],
      });
    }
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY)
      ._id;
    const user = await User.findOne({
      _id: decodedToken,
      "tokens.token": token,
    });
    if (!user) {
      return res.status(404).json({ errors: [{ msg: "user not authorized" }] });
    }
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ errors: [{ msg: "Server error. Failed to verify token" }] });
  }
};

module.exports = auth;
