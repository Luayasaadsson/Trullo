import mongoose from "mongoose";

// Define TaskStatus-enum
export enum TaskStatus {
  TODO = "Todo",
  INPROGRESS = "In Progress",
  COMPLETED = "Completed",
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
  tags: { type: [String] },
});

export default mongoose.model("Task", taskSchema);
