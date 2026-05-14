const express = require("express");
const { body } = require("express-validator");

const {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// @route   POST /api/tasks
// @desc    Create Task
// @access  Admin Only
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  [
    body("title").notEmpty().withMessage("Task title is required"),
    body("description")
      .notEmpty()
      .withMessage("Task description is required"),
    body("projectId").notEmpty().withMessage("Project ID is required"),
    body("assignedTo").notEmpty().withMessage("Assigned user ID is required"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Priority must be low, medium, or high"),
    body("dueDate")
      .notEmpty()
      .withMessage("Task due date is required")
      .isISO8601()
      .withMessage("Due date must be a valid date")
  ],
  createTask
);

// @route   GET /api/tasks/project/:projectId
// @desc    Get Tasks By Project
// @access  Admin + Project Members
router.get(
  "/project/:projectId",
  protect,
  authorizeRoles("admin", "member"),
  getTasksByProject
);

// @route   GET /api/tasks/:id
// @desc    Get Single Task
// @access  Admin + Assigned Member
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "member"),
  getTaskById
);

// @route   PUT /api/tasks/:id
// @desc    Update Full Task
// @access  Admin Only
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateTask
);

// @route   PATCH /api/tasks/:id/status
// @desc    Update Task Status
// @access  Assigned Member + Admin
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin", "member"),
  [
    body("status")
      .notEmpty()
      .withMessage("Task status is required")
      .isIn(["todo", "in-progress", "completed"])
      .withMessage("Invalid task status")
  ],
  updateTaskStatus
);

// @route   DELETE /api/tasks/:id
// @desc    Delete Task
// @access  Admin Only
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteTask
);

module.exports = router;