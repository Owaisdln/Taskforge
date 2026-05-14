const express = require("express");
const { body } = require("express-validator");

const {
  signupUser,
  loginUser,
  getUserProfile
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register new user
// @access  Public
router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .optional()
      .isIn(["admin", "member"])
      .withMessage("Role must be admin or member")
  ],
  signupUser
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  loginUser
);

// @route   GET /api/auth/profile
// @desc    Get logged-in user profile
// @access  Private
router.get(
  "/profile",
  protect,
  getUserProfile
);

module.exports = router;