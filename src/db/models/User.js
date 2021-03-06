const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("./Profile");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.statics.findByCredentials = async function (email, password) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return null;
    }

    return user;
  } catch (err) {
    throw new Error();
  }
};

UserSchema.methods.getAuthToken = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "2 days" }
  );

  return token;
};

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 9);
  }
  next();
});

// remove assosiated profile before deleting user
UserSchema.pre("remove", async function (next) {
  const user = this;
  const profile = await Profile.findOne({ user: user._id });
  if (!profile) next();

  await profile.remove();
  next();
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.tokens;
  return userObj;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
