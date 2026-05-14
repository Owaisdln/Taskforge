const express = require("express");

const { getDashboardData } = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// @route   GET /api/dashboard
// @desc    Dashboard Analytics
// @access  Admin + Member
router.get(
  "/",
  protect,
  authorizeRoles("admin", "member"),
  getDashboardData
);

module.exports = router;