const express = require("express");
const { body } = require("express-validator");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMembers
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// @route   POST /api/projects
// @desc    Create Project
// @access  Admin Only
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  [
    body("title").notEmpty().withMessage("Project title is required"),
    body("description")
      .notEmpty()
      .withMessage("Project description is required"),
    body("deadline")
      .notEmpty()
      .withMessage("Project deadline is required")
      .isISO8601()
      .withMessage("Deadline must be a valid date")
  ],
  createProject
);

// @route   GET /api/projects
// @desc    Get All Projects
// @access  Admin + Member
router.get(
  "/",
  protect,
  authorizeRoles("admin", "member"),
  getProjects
);

// @route   GET /api/projects/:id
// @desc    Get Single Project
// @access  Admin + Assigned Member
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "member"),
  getProjectById
);

// @route   PUT /api/projects/:id
// @desc    Update Project
// @access  Admin Only
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateProject
);

// @route   DELETE /api/projects/:id
// @desc    Delete Project
// @access  Admin Only
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteProject
);

// @route   POST /api/projects/:id/members
// @desc    Add Members to Project
// @access  Admin Only
router.post(
  "/:id/members",
  protect,
  authorizeRoles("admin"),
  [
    body("members")
      .isArray({ min: 1 })
      .withMessage("Members array is required")
  ],
  addProjectMembers
);

module.exports = router;