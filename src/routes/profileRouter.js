const express = require("express");
const User = require("./userRouter");
const Profile = require("../db/models/Profile");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const profileRouter = express.Router();

const profileValidator = [
  check("skills", "Skills field can not be empty").notEmpty(),
];

// route: /api/profile/me
// creates profile for authenticated user
profileRouter.get("/me", (req, res) => {
  res.send("profileRouter working");
});

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

module.exports = profileRouter;
