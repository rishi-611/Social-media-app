const express = require("express");
const User = require("../db/models/User");
const Profile = require("../db/models/Profile");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const profileRouter = express.Router();

const profileValidator = [
  check("skills", "Skills field can not be empty").notEmpty(),
];

// route: POST /api/profile
// PRIVATE
// creates profile for authenticated user
profileRouter.post(
  "/",
  auth,
  check("skills", "skills field can not be empty").notEmpty(),
  check("status", "status field can not be empty").notEmpty(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    const userId = req.user._id;

    const profile = {};
    // profile id set to authenticated user id
    // id wont be provided from client, we get it from auth
    profile.user = userId;

    // convert string seperated by commas to array of strings
    profile.skills = req.body.skills.split(",").map((skill) => skill.trim());

    // deleted skills from body so that it does not override the code above, when the forEach loop is running
    delete req.body.skills;

    // we want social media fields to be stored in an object inside profile
    // hence we filter all the social media fields, and then add them seperately
    const socialFields = [
      "youtube",
      "twitter",
      "facebook",
      "linkedin",
      "instagram",
    ];

    const fields = Object.keys(req.body).filter(
      (field) => !socialFields.includes(field)
    );

    // for each field provided in body, add its value to profile obj
    fields.forEach((field) => {
      profile[field] = req.body[field];
    });

    profile.social = {};
    socialFields.forEach((socialField) => {
      profile.social[socialField] = req.body[socialField];
    });

    try {
      const existingProfile = await Profile.findOne({ user: profile.user });
      let newProfile;
      if (existingProfile) {
        newProfile = await Profile.findOneAndUpdate(
          { user: profile.user },
          { $set: profile },
          { new: true }
        );
      } else {
        newProfile = await new Profile(profile).save();
      }
      return res.json(newProfile);
    } catch (err) {
      res
        .status(500)
        .json({ errors: [{ msg: "server error. Could not update profile" }] });
    }
  }
);
// route: GET /api/profile/me
// PRIVATE
// gets profile of current (authenticated) user
profileRouter.get("/me", auth, async (req, res) => {
  const user = req.user;
  try {
    const profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      return res
        .status(400)
        .json({ errors: [{ msg: "could not find profile for this user" }] });
    }
    await profile.populate("user", ["name", "avatar", "email"]).execPopulate();
    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
});

// route: GET /api/profile/:id
// PUBLIC
profileRouter.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "could not find user" }] });
    }

    const profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      return res
        .status(404)
        .json({ errors: [{ msg: "could not find profile for this user" }] });
    }
    await profile.populate("user", ["name", "avatar", "email"]).execPopulate();
    res.json(profile);
  } catch (err) {
    // if error is caused due to invalid id, throw 404, not 500
    if (err.kind === "ObjectId") {
      return res
        .status(404)
        .json({ errors: [{ msg: "could not find profile for this user" }] });
    }
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
});

// route: GET /api/profile
// gets all profiles
// PUBLIC
profileRouter.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", [
      "name",
      "avatar",
      "email",
    ]);
    if (!profiles)
      return res.status(404).json({ errors: [{ msg: "No profiles found" }] });

    return res.json(profiles);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "" }] });
  }
});

// route: DELETE /api/profile/me
// deletes profile of authenticated user
// PRIVATE
profileRouter.delete("/me", auth, async (req, res) => {
  const { _id } = req.user;
  try {
    const profile = await Profile.findOne({ user: _id });
    await profile.remove();
    res.json();
  } catch (error) {
    console.log(profile);
    res.status(404).json("could not find user");
  }
});

module.exports = profileRouter;
