const User = require("../../models/User");
const bcrypt = require("bcrypt"); // i use it to compere
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../../config/keys");
require("dotenv").config();

const hashPassword = async (password) => {
  //tryc here
  const saltRounds = 10; // fast and scerue // when the number increse the secure will increes but will be more diff
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const createToken = (user) => {
  const payload = {
    username: user.username,
    _id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION_MS,
  });

  return token;
}; // you can create a config.js file and put all the value jwt secret

exports.signin = async (req, res) => {
  try {
    const token = createToken(req.user);
    return res.status(201).json({ token });
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.signup = async (req, res) => {
  try {
    //overrite the hash password
    const { password } = req.body;
    req.body.password = await hashPassword(password);
    //create user
    const newUser = await User.create(req.body);
    //create Token
    const token = createToken(newUser);
    // return token

    return res.status(201).json({
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Server Error");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};
