import Task from "./../models/task";


// Get all tasks
export const getTasks = async () => {
  return await Task.find();
};

// Get a task by ID
export const getTaskById = async (id: string) => {
  return await Task.findById(id);
};

// Create a new task
export const createTask = async (args: {
  title: string;
  description?: string;
  status: string;
  assignedTo?: string;
}) => {
  const newTask = new Task(args);
  return await newTask.save();
};

// Update a task
export const updateTask = async (args: {
  id: string;
  title?: string;
  description?: string;
  status?: string;
}) => {
  // Check if status exists and if it's a valid status
  if (!args.status || args.status.trim() === "") {
    throw new Error("Status is required and cannot be empty");
  }

  // Perform the update
  return await Task.findByIdAndUpdate(args.id, { ...args }, { new: true });
};

// Delete a task
export const deleteTask = async (id: string) => {
  return await Task.findByIdAndDelete(id);
};

// Assign a task to a user
export const assignTask = async (taskId: string, userId: string) => {
  return await Task.findByIdAndUpdate(
    taskId,
    { assignedTo: userId },
    { new: true }
  );
};
