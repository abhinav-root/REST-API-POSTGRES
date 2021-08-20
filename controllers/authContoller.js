const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { sequelize } = require("../models/");

// Register Controller
const register = async (req, res) => {
  const { username, email, password } = req.body;
  // check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.mapped());
  }
  try {
    // hash the password
    const hashed = await bcrypt.hash(password, 12);

    // save user to DB
    const user = await sequelize.models.User.create({
      username,
      email,
      password: hashed,
    });

    // save userId to session
    req.session.user_id = user.id;
    return res.status(201).json({ user_id: user.id });
  } catch (err) {
    console.log(err);
    return res.status(500).json("Please try again");
  }
};

// Login Controller
const login = async (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);

  // validation
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.mapped());
  }

  try {
    const user = await sequelize.models.User.findOne({ where: { email } });
    req.session.user_id = user.id;
    return res.status(200).json({ user_id: user.id });
  } catch (err) {
    console.log(err);
    return res.status(500).json("Please try again");
  }
};

// Logout
const logout = async (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).json("Please login to continue");
  } else {
    res.session.destroy();
    res.clearCookie("sid");
    return res.status(200).json("logout successful");
  }
};

module.exports = { login, register, logout };
