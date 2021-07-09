const express = require("express");
const User = require("../db/models/User");
const Profile = require("../db/models/Profile");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const fetchGithub = require("../utils/fetchGithub");
const {
  isInvalidEducRequest,
  isInvalidExpRequest,
} = require("../utils/validateHelpers");

const profileRouter = express.Router();

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

// route: GET /api/profile/github/:username
// fetches github repos of requested user
// public
profileRouter.get("/github/:username", async (req, res) => {
  try {
    const { data } = await fetchGithub(req.params.username);
    console.log(data);
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json();
  }
});

// EXPERIENCE

// route: POST /api/profile/me/experience
// adds an experience object entry to the experience array of user
// PRIVATE
profileRouter.post(
  "/me/experience",
  [
    auth,
    [
      check("title", "title field can not be empty").notEmpty(),
      check("company", "company field can not be empty").notEmpty(),
      check("from", "from field can not be empty").notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    const userId = req.user._id;

    // check for any fields in body which are not supported
    if (isInvalidExpRequest(req.body)) {
      return res.status(400).json({
        errors: [{ msg: "there are some invalid fields in your request" }],
      });
    }

    // if current is not explicitely set to false
    // and to is not provided, then we assume that
    // user is currently working for the company
    if (!req.body.to && req.body.current !== false) {
      req.body.current = true;
    }

    try {
      const profile = await Profile.findOne({ user: userId });
      if (!profile) {
        res.status(400).json({
          errors: [
            { msg: "You can only add experience after creating a profile" },
          ],
        });
      }

      profile.experience.unshift(req.body);

      await profile.save();

      res.status(200).json(profile);
    } catch (err) {
      res.status(500).json();
    }
  }
);

// EDUCATION

// route: POST /api/profile/me/education
// adds an education object entry to the education array of user
// PRIVATE
profileRouter.post(
  "/me/education",
  auth,
  check("school", "school field can not be empty").notEmpty(),
  check("degree", "degree field can not be empty").notEmpty(),
  check("fieldofstudy", "fieldofstudy field can not be empty").notEmpty(),
  check("from", "from field can not be empty").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    const userId = req.user._id;

    // check for any fields in body which are not supported
    if (isInvalidEducRequest(req.body)) {
      return res.status(400).json({
        errors: [{ msg: "there are some invalid fields in your request" }],
      });
    }
    if (!req.body.to && req.body.current !== false) {
      req.body.current = true;
    }

    try {
      const profile = await Profile.findOne({ user: userId });
      if (!profile) {
        res.status(400).json({
          errors: [
            { msg: "You can only add education after creating a profile" },
          ],
        });
      }

      profile.education.unshift(req.body);

      await profile.save();

      res.status(200).json(profile);
    } catch (err) {
      console.log(err);
      res.status(500).json();
    }
  }
);

// route: PATCH /api/profile/me/education/:educId
// edits education by id
// PRIVATE
profileRouter.patch("/me/education/:educId", auth, async (req, res) => {
  const educId = req.params.educId;
  const userId = req.user._id;

  if (isInvalidEducRequest(req.body)) {
    return res.status(400).json({
      errors: [{ msg: "there are some invalid fields in your request" }],
    });
  }

  try {
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res
        .status(404)
        .json("there is no profile associated to this user");
    }

    const educIndex = profile.education.findIndex(
      (educ) => educ._id.toString() === educId
    );
    if (educIndex === -1) {
      return res
        .status(404)
        .json("Education object with requested id not found");
    }
    // edit fields
    Object.keys(req.body).forEach((field) => {
      profile.education[educIndex][field] = req.body[field];
    });
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json("server error");
  }
});

// route: DELETE /api/profile/me/experience/:expId
// removes  experience object by id from the experience array of user
// PRIVATE
profileRouter.delete("/me/experience/:expId", auth, async (req, res) => {
  const expId = req.params.expId;
  const userId = req.user._id;
  try {
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res
        .status(404)
        .json("there is no profile associated to this user");
    }

    const expIndex = profile.experience.findIndex(
      (exp) => exp._id.toString() === expId
    );
    if (expIndex === -1) {
      return res
        .status(404)
        .json("Experience object with requested id not found");
    }
    profile.experience.splice(expIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json("server error");
  }
});

// route: DELETE /api/profile/me/education/:educId
// removes  education object by id from the educaition array of user
// PRIVATE
profileRouter.delete("/me/education/:educId", auth, async (req, res) => {
  const educId = req.params.educId;
  const userId = req.user._id;
  try {
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res
        .status(404)
        .json("there is no profile associated to this user");
    }

    const educIndex = profile.education.findIndex(
      (educ) => educ._id.toString() === educId
    );
    if (educIndex === -1) {
      return res
        .status(404)
        .json("Education object with requested id not found");
    }
    profile.education.splice(educIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json("server error");
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
