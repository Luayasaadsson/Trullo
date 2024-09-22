import mongoose from "mongoose";
import Task from "../models/taskModel";
import Project from "../models/projectModel";
import { TaskStatus } from "../models/taskModel";
import User from "../models/userModel";
import { UserContext } from "./../types/types";
import { checkAuth } from "../utils/authUtils";
import { isValidObjectId } from "../utils/idValidationUtils";

// Get all tasks
export const getTasks = async (context: UserContext) => {
  try {
    checkAuth(context, ["admin", "user"], {
      authentication: "You must be logged in to view tasks.",
    });
    const tasks = await Task.find();
    if (!tasks || tasks.length === 0) {
      throw new Error("No tasks found");
    }
    return tasks;
  } catch (error) {
    throw new Error(`Failed to get tasks: ${(error as Error).message}`);
  }
};

// Get a task by ID
export const getTaskById = async (id: string, context: UserContext) => {
  try {
    checkAuth(context, ["admin", "user"], {
      authentication: "You must be logged in to view a task.",
    });

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
    throw new Error(`Failed to get task: ${(error as Error).message}`);
  }
};

// Create a new task
export const createTask = async (
  args: {
    title: string;
    description: string;
    status: string;
    assignedTo: string;
    finishedBy?: string;
    project: string;
    tags?: string[];
  },
  context: UserContext
) => {
  try {
    checkAuth(context, ["admin", "user"], {
      authentication: "You must be logged in to create tasks.",
      authorization:
        "You do not have the necessary permissions to create tasks.",
    });

    const status = args.status as TaskStatus;

    // Check if the given status is a valid TaskStatus
    if (!Object.values(TaskStatus).includes(status)) {
      throw new Error(
        `Invalid task status: ${
          args.status
        }. Allowed values are ${Object.values(TaskStatus).join(", ")}`
      );
    }
    // Validate that title, description, and status are not missing or empty
    if (!args.title || !args.status || !args.description) {
      throw new Error("Title, description and status are required");
    }

    // Validate that the project ID is a valid ObjectId
    if (!isValidObjectId(args.project)) {
      throw new Error("Invalid project ID format");
    }

    // Validate that the assignedTo ID is a valid ObjectId
    if (!isValidObjectId(args.assignedTo)) {
      throw new Error("Invalid assignedTo ID format");
    }

    // Validate that the finishedBy ID is a valid ObjectId (if provided)
    if (args.finishedBy && !isValidObjectId(args.finishedBy)) {
      throw new Error("Invalid finishedBy ID format.");
    }

    // Validate that the tags array contains only strings (if provided)
    if (
      args.tags &&
      (!Array.isArray(args.tags) ||
        args.tags.some((tag) => typeof tag !== "string"))
    ) {
      throw new Error("Tags must be an array of strings.");
    }

    const newTask = new Task({
      title: args.title,
      description: args.description,
      status: args.status,
      assignedTo: args.assignedTo,
      finishedBy: args.finishedBy,
      project: args.project,
      tags: args.tags,
    });

    const savedTask = await newTask.save();

    const project = await Project.findById(args.project);
    if (!project) {
      throw new Error(`Project with ID ${args.project} not found`);
    }

    project.tasks.push(savedTask._id);
    await project.save();

    return savedTask;
  } catch (error) {
    throw new Error(`Failed to create task: ${(error as Error).message}`);
  }
};

// Update a task
export const updateTask = async (
  args: {
    id: string;
    title?: string;
    description?: string;
    status?: string;
    finishedBy?: string;
    project?: string;
    tags?: string[];
  },
  context: UserContext
) => {
  try {
    checkAuth(context, ["admin", "user"], {
      authentication: "You must be logged in to update tasks.",
      authorization:
        "You do not have the necessary permissions to update tasks.",
    });

    // Validate that the ID has the correct format
    if (!isValidObjectId(args.id)) {
      throw new Error("Invalid task ID format");
    }

    // If status is provided, cast it to TaskStatus and validate
    if (args.status) {
      const status = args.status as TaskStatus;
      if (!Object.values(TaskStatus).includes(status)) {
        throw new Error(
          `Invalid task status: ${
            args.status
          }. Allowed values are ${Object.values(TaskStatus).join(", ")}`
        );
      }
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

    // Validate that the project ID is a valid ObjectId
    if (args.project && !isValidObjectId(args.project)) {
      throw new Error("Invalid project ID format");
    }

    // Validate that the finishedBy ID is a valid ObjectId (if provided)
    if (args.finishedBy && !isValidObjectId(args.finishedBy)) {
      throw new Error("Invalid finishedBy ID format");
    }

    // Validate that the tags array contains only strings (if provided)
    if (
      args.tags &&
      (!Array.isArray(args.tags) ||
        args.tags.some((tag) => typeof tag !== "string"))
    ) {
      throw new Error("Tags must be an array of strings.");
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
export const deleteTask = async (id: string, context: UserContext) => {
  try {
    checkAuth(context, ["admin", "user"], {
      authentication: "You must be logged in to delete tasks.",
      authorization:
        "You do not have the necessary permissions to delete tasks.",
    });

    // Check if task exists before deletion
    const task = await Task.findById(id);
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }

    const project = await Project.findById(task.project);
    if (project) {
      project.tasks = project.tasks.filter(
        (taskId: mongoose.Types.ObjectId) => taskId.toString() !== id
      );
      await project.save();
    }

    return await Task.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Failed to delete task: ${(error as Error).message}`);
  }
};

// Assign a task to a user
export const assignTask = async (
  taskId: string,
  userId: string,
  context: UserContext
) => {
  try {
    checkAuth(context, ["admin", "user"], {
      authentication: "You must be logged in to assign tasks.",
      authorization:
        "You do not have the necessary permissions to assign tasks.",
    });

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
    const assignedUser = await User.findById(userId);
    if (!assignedUser) {
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
