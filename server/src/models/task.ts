import mongoose from "mongoose";

// Define TaskStatus-enum
export enum TaskStatus {
  TODO = "Todo",
  PENDING = "Pending",
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
});

export default mongoose.model("Task", taskSchema);