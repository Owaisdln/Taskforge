const Project = require("../models/Project");
const Task = require("../models/Task");

// @desc    Get Dashboard Analytics
// @route   GET /api/dashboard
// @access  Admin + Member
const getDashboardData = async (req, res) => {
  try {
    const today = new Date();

    // ADMIN DASHBOARD
    if (req.user.role === "admin") {
      const totalProjects = await Project.countDocuments();

      const totalTasks = await Task.countDocuments();

      const completedTasks = await Task.countDocuments({
        status: "completed"
      });

      const pendingTasks = await Task.countDocuments({
        status: {
          $in: ["todo", "in-progress"]
        }
      });

      const overdueTasks = await Task.countDocuments({
        dueDate: { $lt: today },
        status: { $ne: "completed" }
      });

      return res.status(200).json({
        success: true,
        role: "admin",
        dashboard: {
          totalProjects,
          totalTasks,
          completedTasks,
          pendingTasks,
          overdueTasks
        }
      });
    }

    // MEMBER DASHBOARD
    const assignedTasks = await Task.countDocuments({
      assignedTo: req.user._id
    });

    const completedTasks = await Task.countDocuments({
      assignedTo: req.user._id,
      status: "completed"
    });

    const pendingTasks = await Task.countDocuments({
      assignedTo: req.user._id,
      status: {
        $in: ["todo", "in-progress"]
      }
    });

    const overdueTasks = await Task.countDocuments({
      assignedTo: req.user._id,
      dueDate: { $lt: today },
      status: { $ne: "completed" }
    });

    return res.status(200).json({
      success: true,
      role: "member",
      dashboard: {
        assignedTasks,
        completedTasks,
        pendingTasks,
        overdueTasks
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getDashboardData
};