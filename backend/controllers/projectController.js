const Project = require("../models/Project");
const User = require("../models/User");
const { validationResult } = require("express-validator");

// @desc    Create Project
// @route   POST /api/projects
// @access  Admin Only
const createProject = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { title, description, members, deadline } = req.body;

    if (members && members.length > 0) {
      const validMembers = await User.find({
        _id: { $in: members }
      });

      if (validMembers.length !== members.length) {
        return res.status(400).json({
          success: false,
          message: "One or more member IDs are invalid"
        });
      }
    }

    const project = await Project.create({
      title,
      description,
      createdBy: req.user._id,
      members: members || [],
      deadline
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get All Projects
// @route   GET /api/projects
// @access  Admin + Member
const getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === "admin") {
      projects = await Project.find()
        .populate("createdBy", "name email role")
        .populate("members", "name email role");
    } else {
      projects = await Project.find({
        members: req.user._id
      })
        .populate("createdBy", "name email role")
        .populate("members", "name email role");
    }

    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get Single Project
// @route   GET /api/projects/:id
// @access  Admin + Assigned Member
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    if (req.user.role === "admin") {
      return res.status(200).json({
        success: true,
        project
      });
    }

    const isMember = project.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update Project
// @route   PUT /api/projects/:id
// @access  Admin Only
const updateProject = async (req, res) => {
  try {
    const { title, description, status, deadline } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.status = status || project.status;
    project.deadline = deadline || project.deadline;

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete Project
// @route   DELETE /api/projects/:id
// @access  Admin Only
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add Members to Project
// @route   POST /api/projects/:id/members
// @access  Admin Only
const addProjectMembers = async (req, res) => {
  try {
    const { members } = req.body;

    if (!members || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Members array is required"
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const validMembers = await User.find({
      _id: { $in: members }
    });

    if (validMembers.length !== members.length) {
      return res.status(400).json({
        success: false,
        message: "One or more member IDs are invalid"
      });
    }

    const uniqueMembers = [
      ...new Set([
        ...project.members.map((id) => id.toString()),
        ...members
      ])
    ];

    project.members = uniqueMembers;

    await project.save();

    res.status(200).json({
      success: true,
      message: "Members added successfully",
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMembers
};