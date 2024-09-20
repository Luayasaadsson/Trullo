import UserType from "../types/UserType";
import TaskType from "../types/TaskType";
import ProjectType from "../types/ProjectType";
import Project from "../../models/projectModel";
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} from "graphql";
import {
  createUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
  loginUser,
  requestPasswordReset,
  resetPassword,
} from "./../../resolvers/userResolver";
import {
  createTask,
  updateTask,
  deleteTask,
  assignTask,
} from "./../../resolvers/taskResolver";

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // User mutations
    createUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: GraphQLString },
      },
      async resolve(parent, args) {
        return await createUser({
          name: args.name,
          email: args.email,
          password: args.password,
          role: args.role,
        });
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLString },
      },
      async resolve(parent, args, context) {
        if (!context.user) {
          throw new Error("Authentication required");
        }
        if (context.user.role !== "admin") {
          throw new Error("Unauthorized: Only admin can update users");
        }
        return await updateUser({
          id: args.id,
          name: args.name,
          email: args.email,
          password: args.password,
        });
      },
    },
    deleteUser: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      async resolve(parent, args, context) {
        if (!context.user) {
          throw new Error("Authentication required");
        }
        if (context.user.role !== "admin") {
          throw new Error("Unauthorized: Only admin can delete users");
        }
        return await deleteUser(args.id);
      },
    },
    deleteAllUsers: {
      type: GraphQLString,
      async resolve(_, args, context) {
        if (!context.user) {
          throw new Error("Authentication required");
        }
        if (context.user.role !== "admin") {
          throw new Error("Unauthorized: Only admin can delete users");
        }
        return await deleteAllUsers();
      },
    },
    loginUser: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        return await loginUser(args.email, args.password);
      },
    },
    requestPasswordReset: {
      type: GraphQLString,
      args: { email: { type: new GraphQLNonNull(GraphQLString) } },
      async resolve(parent, args) {
        return await requestPasswordReset(args.email);
      },
    },
    resetPassword: {
      type: GraphQLString,
      args: {
        token: { type: new GraphQLNonNull(GraphQLString) },
        newPassword: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        return await resetPassword(args.token, args.newPassword);
      },
    },

    // Project mutations
    createProject: {
      type: ProjectType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
      },
      resolve(parent, args) {
        const newProject = new Project({
          name: args.name,
          description: args.description,
        });
        return newProject.save();
      },
    },

    // Task mutations
    createTask: {
      type: TaskType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        status: { type: new GraphQLNonNull(GraphQLString) },
        assignedTo: { type: GraphQLID },
        finishedBy: { type: GraphQLID },
        project: { type: new GraphQLNonNull(GraphQLID) },
        tags: { type: new GraphQLList(GraphQLString) },
      },
      resolve(parent, args) {
        return createTask({
          title: args.title,
          description: args.description,
          status: args.status,
          assignedTo: args.assignedTo,
          finishedBy: args.finishedBy,
          project: args.project,
          tags: args.tags,
        });
      },
    },
    updateTask: {
      type: TaskType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: new GraphQLNonNull(GraphQLString) },
        finishedBy: { type: GraphQLID },
        tags: { type: new GraphQLList(GraphQLString) },
      },
      resolve(parent, args) {
        return updateTask({
          id: args.id,
          title: args.title,
          description: args.description,
          status: args.status,
          finishedBy: args.finishedBy,
          tags: args.tags,
        });
      },
    },
    deleteTask: {
      type: TaskType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return deleteTask(args.id);
      },
    },
    assignTask: {
      type: TaskType,
      args: {
        taskId: { type: new GraphQLNonNull(GraphQLID) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return assignTask(args.taskId, args.userId);
      },
    },
  },
});

export default Mutation;
