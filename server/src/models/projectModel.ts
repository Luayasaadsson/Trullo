import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

export default mongoose.model("Project", projectSchema);
