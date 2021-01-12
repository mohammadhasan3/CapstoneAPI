/* Requires */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../../config/keys");

// Database
const { User } = require("../../db/models");
const { Profile } = require("../../db/models");
/* Requires */

exports.signup = async (req, res, next) => {
  const { password } = req.body;
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("exports.signup -> hashedPassword", hashedPassword);
    req.body.password = hashedPassword;

    const newUser = await User.create(req.body);

    // creating profile after creating the user
    const newProfile = await Profile.create({ userId: newUser.id });
    newUser.update({ profileId: newProfile.id });

    const payload = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      exp: Date.now() + JWT_EXPIRATION_MS,
      image: newProfile.image,
      bio: newProfile.bio,
      profileId: newProfile.id,
    };

    const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res) => {
  const { user } = req;

  const foundProfile = await Profile.findByPk(req.user.profileId);

  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    exp: Date.now() + parseInt(JWT_EXPIRATION_MS),
    image: foundProfile.image,
    bio: foundProfile.bio,
    profileId: foundProfile.id,
  };

  const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
  res.json({ token });
};

//UsersList
exports.usersList = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { include: ["username"] },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};
