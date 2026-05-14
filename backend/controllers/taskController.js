const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const { validationResult } = require("express-validator");

// @desc    Create Task
// @route   POST /api/tasks
// @access  Admin Only
const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      projectId,
      assignedTo,
      priority,
      dueDate
    } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const user = await User.findById(assignedTo);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Assigned user not found"
      });
    }

    const isMember = project.members.some(
      (memberId) => memberId.toString() === assignedTo
    );

    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: "Assigned user is not a member of this project"
      });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      assignedBy: req.user._id,
      priority,
      dueDate
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get Tasks By Project
// @route   GET /api/tasks/project/:projectId
// @access  Admin + Assigned Members
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    if (req.user.role !== "admin") {
      const isMember = project.members.some(
        (memberId) => memberId.toString() === req.user._id.toString()
      );

      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: "Access denied"
        });
      }
    }

    const tasks = await Task.find({ projectId })
      .populate("assignedTo", "name email role")
      .populate("assignedBy", "name email role")
      .populate("projectId", "title");

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get Single Task
// @route   GET /api/tasks/:id
// @access  Admin + Assigned Member
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email role")
      .populate("assignedBy", "name email role")
      .populate("projectId", "title");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    if (
      req.user.role !== "admin" &&
      task.assignedTo._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update Full Task
// @route   PUT /api/tasks/:id
// @access  Admin Only
const updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      priority,
      status,
      dueDate
    } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    if (assignedTo) {
      const user = await User.findById(assignedTo);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found"
        });
      }
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.assignedTo = assignedTo || task.assignedTo;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update Task Status
// @route   PATCH /api/tasks/:id/status
// @access  Assigned Member + Admin
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["todo", "in-progress", "completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task status"
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    if (
      req.user.role !== "admin" &&
      task.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    task.status = status;

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete Task
// @route   DELETE /api/tasks/:id
// @access  Admin Only
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask
};