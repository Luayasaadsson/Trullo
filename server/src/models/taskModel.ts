import mongoose from "mongoose";

// Define TaskStatus-enum
export enum TaskStatus {
  TODO = "Todo",
  INPROGRESS = "In Progress",
  COMPLETED = "Completed",
}

// Define TagsStatus-enum
export enum TaskTagStatus {
  URGENT = "Urgent",
  HIGH_PRIORITY = "High Priority",
  LOW_PRIORITY = "Low Priority",
  MAINTENANCE = "Maintenance",
  DOCUMENTATION = "Documentation",
  RESEARCH = "Research",
  BACKLOG = "Backlog",
  TESTING = "Testing",
  DEPLOYMENT = "Deployment",
  DISCUSSION = "Discussion",
}

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(TaskStatus), // Limit values to enum
    required: true,
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  finishedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  tags: {
    type: [String],
    /* validate: {
      validator: function (tags: string[]) {
        // Converting the tag to a string and compare it with the enum values
        return (
          tags.length > 0 &&
          tags.every(
            (tag) =>
              Object.values(TaskTagStatus).includes(tag as TaskTagStatus) ||
              tag.trim().length > 0
          )
        );
      },
      message:
        `Tags must include at least one non-empty value. ` +
        `You can choose from predefined tags: ${Object.values(
          TaskTagStatus
        ).join(", ")}, or provide your own custom tag.`,
    },
    required: true, */
  },
});

export default mongoose.model("Task", taskSchema);
