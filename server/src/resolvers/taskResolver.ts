import Task from "./../models/task";
import { TaskStatus } from "./../models/task";
import User from "./../models/user";
import { isValidObjectId } from "../utils/idValidationUtils";

// Get all tasks
export const getTasks = async () => {
  try {
    const tasks = await Task.find();
    if (!tasks || tasks.length === 0) {
      throw new Error("No tasks found");
    }
    return tasks;
  } catch (error) {
    throw new Error(`Failed to fetch tasks: ${(error as Error).message}`);
  }
};

// Get a task by ID
export const getTaskById = async (id: string) => {
  try {
    // Validate that the ID has the correct format
    if (!isValidObjectId(id)) {
      throw new Error("Invalid task ID format");
    }

    const task = await Task.findById(id);
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }
    return task;
  } catch (error) {
    throw new Error(`Failed to fetch task: ${(error as Error).message}`);
  }
};

// Create a new task
export const createTask = async (args: {
  title: string;
  description: string;
  status: string;
  assignedTo: string;
}) => {
  try {
    const status = args.status as TaskStatus;

    // Check if the given status is a valid TaskStatus
    if (!Object.values(TaskStatus).includes(status)) {
      throw new Error(
        `Invalid task status: ${
          args.status
        }. Allowed values are ${Object.values(TaskStatus).join(", ")}`
      );
    }

    if (!args.title || !args.status || !args.description) {
      throw new Error("Title, description and status are required");
    }

    const newTask = new Task(args);
    return await newTask.save();
  } catch (error) {
    throw new Error(`Failed to create task: ${(error as Error).message}`);
  }
};

// Update a task
export const updateTask = async (args: {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  finishedBy?: string;
}) => {
  try {
    // Validate that the ID has the correct format
    if (!isValidObjectId(args.id)) {
      throw new Error("Invalid task ID format");
    }

    // If status is provided, cast it to TaskStatus and validate
    if (args.status) {
      const status = args.status as TaskStatus; // Cast as TaskStatus
      if (!Object.values(TaskStatus).includes(status)) {
        throw new Error(
          `Invalid task status: ${
            args.status
          }. Allowed values are ${Object.values(TaskStatus).join(", ")}`
        );
      }
      args.status = status; // Update status with the cast value
    }

    // Check if the task exists
    const task = await Task.findById(args.id);
    if (!task) {
      throw new Error(`Task with ID ${args.id} not found`);
    }

    // Validate that title is not missing or empty
    if (args.title === undefined || args.title.trim() === "") {
      throw new Error("Title is required and cannot be empty");
    }

    // Validate that description is not missing or empty
    if (args.description === undefined || args.description.trim() === "") {
      throw new Error("Description is required and cannot be empty");
    }

    // Validate that status is not missing or empty
    if (args.status === undefined || args.status.trim() === "") {
      throw new Error("Status is required and cannot be empty");
    }

    // Perform the update
    const updatedTask = await Task.findByIdAndUpdate(
      args.id,
      { ...args },
      { new: true }
    );
    return updatedTask;
  } catch (error) {
    throw new Error(`Failed to update task: ${(error as Error).message}`);
  }
};

// Delete a task
export const deleteTask = async (id: string) => {
  try {
    // Check if task exists before deletion
    const task = await Task.findById(id);
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }

    return await Task.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Failed to delete task: ${(error as Error).message}`);
  }
};

// Assign a task to a user
export const assignTask = async (taskId: string, userId: string) => {
  try {
    // Validate the format of the task ID
    if (!isValidObjectId(taskId)) {
      throw new Error("Invalid task ID format");
    }

    // Validate the format of the user ID
    if (!isValidObjectId(userId)) {
      throw new Error("Invalid user ID format");
    }

    // Check if the task exists
    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found`);
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Update the assignedTo field
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { assignedTo: userId },
      { new: true }
    );

    if (!updatedTask) {
      throw new Error(`Failed to update task with ID ${taskId}`);
    }

    return updatedTask;
  } catch (error) {
    // More detailed error information
    const errorMessage = (error as Error).message;
    if (errorMessage.includes("Invalid task ID format")) {
      throw new Error(
        `Error: ${errorMessage}. Please check the format of the task ID.`
      );
    }
    if (errorMessage.includes("Invalid user ID format")) {
      throw new Error(
        `Error: ${errorMessage}. Please check the format of the user ID.`
      );
    }
    if (errorMessage.includes("Task with ID")) {
      throw new Error(
        `Error: ${errorMessage}. Ensure that the task ID is correct.`
      );
    }
    if (errorMessage.includes("User with ID")) {
      throw new Error(
        `Error: ${errorMessage}. Ensure that the user ID is correct.`
      );
    }
    throw new Error(`Failed to assign task: ${errorMessage}`);
  }
};
