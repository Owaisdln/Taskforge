const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true
    },

    description: {
      type: String,
      required: [true, "Project description is required"]
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active"
    },

    deadline: {
      type: Date,
      required: [true, "Project deadline is required"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Project", projectSchema);