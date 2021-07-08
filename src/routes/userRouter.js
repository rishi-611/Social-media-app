const express = require("express");
const { validationResult, check } = require("express-validator");
const gravatar = require("gravatar");
const User = require("../db/models/User");
const auth = require("../middleware/auth");

const userRouter = express.Router();

// route: /users
// creates a new user
userRouter.post(
  "/",
  [
    check("name", "You must provide a name").notEmpty(),
    check("email", "You must provide a valid email address").isEmail(),
    check("password", "Password should be atleast 6 characters long").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, password, email } = req.body;
    try {
      // gravatars are the avatars that show in websites from you gmail
      // like the picture associated with your email.
      // gravatar.url looks for gravatar associated to the email,
      // options: s: size , d: default (if no avatar is found) , r: rating (for pg, images cant be naked, etc)
      const avatar = await gravatar.url(email, {
        s: "200",
        d: "mm",
        r: "pg",
      });
      const user = new User({
        name,
        email,
        password,
        avatar,
      });
      const userAlreadyExists = await User.findOne({ email });
      if (userAlreadyExists) {
        return res.status(400).json({
          errors: [{ msg: "User will the same email address already exists" }],
        });
      }
      // get jwt token
      const token = await user.getAuthToken();
      user.tokens = user.tokens.concat({ token });
      await user.save();
      return res.status(201).json({ user, token });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

// login existing user
userRouter.post("/login", async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res
      .status(400)
      .json({ errors: [{ msg: "You must provide username and password" }] });
  }
  const user = await User.findByCredentials(name, password);
  if (!user) {
    return res.status(400).json({ errprs: [{ msg: "Invalid credentials" }] });
  }

  const token = await user.getAuthToken();
  user.tokens = user.tokens.concat({ token });
  await user.save();
  res.send({ user, token });
});

// logout active user (RESTRICTED)
userRouter.post("/logout", auth, async (req, res) => {
  const { user, _id } = req;
  user.tokens = user.tokens.filter((token) => token.token !== req.token);
  try {
    await user.save();
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ errors: [{ msg: "server error" }] });
  }
});

// logout all users
userRouter.post("/logoutAll", auth, async (req, res) => {
  const { user, _id } = req;
  user.tokens = [];
  try {
    await user.save();
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ errors: [{ msg: "server error" }] });
  }
});

// get user by id (RESTRICTED)
userRouter.get("/:id", auth, async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({
      errors: [{ msg: "please provide id of the user to be fetched" }],
    });
  }

  try {
    const user = await User.findById(userId);
    return res.send({ user });
  } catch (err) {
    res.status(500).json({
      errors: [{ msg: "Server error" }],
    });
  }
});

// route: /users/"id"
// deletes user (RESTRICTED)
userRouter.delete("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "could not find user" }] });
    }
    await user.remove();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ errors: [{ msg: "server error" }] });
  }
});

module.exports = userRouter;
