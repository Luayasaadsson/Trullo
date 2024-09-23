import UserType from "../types/UserType";
import TaskType from "../types/TaskType";
import ProjectType from "../types/ProjectType";
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
import {
  createProject,
  updateProject,
  deleteProject,
  deleteAllProjects,
} from "./../../resolvers/projectResolver";

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
        return await updateUser(
          {
            id: args.id,
            name: args.name,
            email: args.email,
            password: args.password,
          },
          context
        );
      },
    },
    deleteUser: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      async resolve(parent, args, context) {
        return await deleteUser(args.id, context);
      },
    },
    deleteAllUsers: {
      type: GraphQLString,
      async resolve(_, args, context) {
        return await deleteAllUsers(context);
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
        oldPassword: { type: new GraphQLNonNull(GraphQLString) },
        newPassword: { type: new GraphQLNonNull(GraphQLString) },
        confirmPassword: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        return await resetPassword(args.token, args.oldPassword, args.newPassword, args.confirmPassword);
      },
    },

    // Project mutations
    createProject: {
      type: ProjectType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
      },
      resolve: async (parent, args, context) => {
        return createProject(
          { name: args.name, description: args.description },
          context
        );
      },
    },
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
      },
      resolve: async (parent, args, context) => {
        return updateProject(
          { id: args.id, name: args.name, description: args.description },
          context
        );
      },
    },
    deleteProject: {
      type: ProjectType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (parent, args, context) => {
        return deleteProject(args.id, context);
      },
    },
    deleteAllProjects: {
      type: GraphQLString,
      resolve: async (parent, args, context) => {
        return deleteAllProjects(context);
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
      resolve: async (parent, args, context) => {
        return await createTask(
          {
            title: args.title,
            description: args.description,
            status: args.status,
            assignedTo: args.assignedTo,
            finishedBy: args.finishedBy,
            project: args.project,
            tags: args.tags,
          },
          context
        );
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
      resolve(parent, args, context) {
        return updateTask(
          {
            id: args.id,
            title: args.title,
            description: args.description,
            status: args.status,
            finishedBy: args.finishedBy,
            tags: args.tags,
          },
          context
        );
      },
    },
    deleteTask: {
      type: TaskType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (parent, args, context) => {
        return await deleteTask(args.id, context);
      },
    },
    assignTask: {
      type: TaskType,
      args: {
        taskId: { type: new GraphQLNonNull(GraphQLID) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args, context) {
        return assignTask(args.taskId, args.userId, context);
      },
    },
  },
});

export default Mutation;
