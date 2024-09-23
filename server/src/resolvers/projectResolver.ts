import Project from "../models/projectModel";
import { isValidObjectId } from "../utils/idValidationUtils";
import { UserContext } from "./../types/types";
import { checkAuth } from "../utils/authUtils";

export const getProjects = async (context: UserContext) => {
  try {
    checkAuth(context, ["admin", "user"], {
      authentication: "You must be logged in to view projects.",
      authorization:
        "Unauthorized: You do not have permission to view projects.",
    });

    const projects = await Project.find();
    if (!projects || projects.length === 0) {
      throw new Error("No projects found.");
    }

    return projects;
  } catch (error) {
    throw new Error(`Failed to get projects: ${(error as Error).message}`);
  }
};

export const getProjectById = async (id: string, context: UserContext) => {
  try {
    checkAuth(context, ["admin", "user"], {
      authentication: "You must be logged in to view this project.",
      authorization:
        "Unauthorized: You do not have permission to view this project.",
    });

    // Checks if id is a valid ObjectId
    if (!isValidObjectId(id)) {
      throw new Error("Invalid project ID format.");
    }

    const project = await Project.findById(id);
    if (!project) {
      throw new Error(`Project with ID ${id} not found.`);
    }

    return project;
  } catch (error) {
    throw new Error(`Failed to get project: ${(error as Error).message}`);
  }
};

export const createProject = async (
  args: { name: string; description: string },
  context: UserContext
) => {
  checkAuth(context, ["admin", "user"], {
    authentication: "Authentication required to create a project.",
    authorization:
      "You do not have the necessary permissions to create projects.",
  });

  const newProject = new Project({
    name: args.name,
    description: args.description,
  });

  return newProject.save();
};

export const updateProject = async (
  args: { id: string; name: string; description: string },
  context: UserContext
) => {
  checkAuth(context, ["admin", "user"], {
    authentication: "Authentication required to update a project.",
    authorization:
      "You do not have the necessary permissions to update projects.",
  });

  if (!isValidObjectId(args.id)) {
    throw new Error("Invalid project ID format.");
  }

  return Project.findByIdAndUpdate(
    args.id,
    { name: args.name, description: args.description },
    { new: true }
  );
};

export const deleteProject = async (id: string, context: UserContext) => {
  checkAuth(context, ["admin", "user"], {
    authentication: "Authentication required to delete a project.",
    authorization:
      "You do not have the necessary permissions to delete projects.",
  });

  if (!isValidObjectId(id)) {
    throw new Error("Invalid project ID format.");
  }

  return Project.findByIdAndDelete(id);
};

export const deleteAllProjects = async (context: UserContext) => {
  checkAuth(context, ["admin"], {
    authentication: "Authentication required to delete all projects.",
    authorization: "Only admin can delete all projects.",
  });

  const result = await Project.deleteMany();

  if (result.deletedCount === 0) {
    throw new Error("No projects found to delete.");
  }

  return `${result.deletedCount} projects deleted.`;
};
