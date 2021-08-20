const router = require("express").Router();
const { body } = require("express-validator");
const authController = require("../controllers/authContoller");
const { sequelize } = require("../models/");
const bcrypt = require("bcrypt");

// REGISTER NEW USER
router.post(
  "/register",
  body("username")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Username cannot be empty")
    .custom((value) => {
      if (Number.isInteger(parseInt(value[0]))) {
        throw new Error("invalid");
      }
      return true;
    })
    .withMessage("Usename cannot start with a number")
    .custom((value) => {
      if (value.indexOf(" ") > 0) {
        throw new Error("invalid");
      }
      return true;
    })
    .withMessage("Username cannot contain spaces")
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric")
    .isLength({ min: 3 })
    .withMessage("Username is too short")
    .isLength({ max: 20 })
    .withMessage("Username is too long")
    .custom(async (value) => {
      const user = await sequelize.models.User.findOne({
        where: { username: value },
      });
      if (user) {
        throw new Error("invalid");
      }
      return true;
    })
    .withMessage("This username is already taken"),
  body("email")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom(async (value) => {
      const user = await sequelize.models.User.findOne({
        where: { email: value },
      });
      if (user) {
        throw new Error("invalid email");
      }
      return true;
    })
    .withMessage("This email is already registered"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 6 })
    .withMessage("Password length must be atleast 6")
    .isLength({ max: 15 })
    .withMessage("Password is too long"),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm Password cannot be empty")
    .custom((value, { req }) => {
      const match = value === req.body.password;
      if (!match) {
        throw new Error("not a match");
      }
      return true;
    })
    .withMessage("Passwords don't match"),

  authController.register
);

// LOGIN USER
router.post(
  "/login",
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom(async (value, { req }) => {
      const user = await sequelize.models.User.findOne({
        where: { email: value },
      });
      console.log(user);
      if (!user) {
        throw new Error("invalid email");
      } else {
        const validPass = await bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!validPass) {
          throw new Error("invalid email");
        }
      }
      return true;
    })
    .withMessage("Invalid username or password"),
  body("password").trim().notEmpty().withMessage("Password cannot be empty"),

  authController.login
);

// check authentication
router.post("/authenticate", (req, res) => {
  if (req.session.user_id) {
    return res.status(200).end();
  } else {
    return res.status(401).end();
  }
});

router.post("/logout", authController.logout);

module.exports = router;
