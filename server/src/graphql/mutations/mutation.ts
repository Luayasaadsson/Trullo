import UserType from "../types/UserType";
import TaskType from "../types/TaskType";
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
} from "graphql";
import {
  createUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
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
      },
      async resolve(parent, args) {
        try {
          // Sending the hashed password to createUser
          return createUser({
            name: args.name,
            email: args.email,
            password: args.password,
          });
        } catch (err) {
          throw new Error(`Error creating user: ${(err as Error).message}`);
        }
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
      async resolve(parent, args) {
        try {
          return await updateUser({
            id: args.id,
            name: args.name,
            email: args.email,
            password: args.password,
          });
        } catch (err) {
          throw new Error(`Error updating user: ${(err as Error).message}`);
        }
      },
    },

    deleteUser: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return deleteUser(args.id);
      },
    },
    deleteAllUsers: {
      type: GraphQLString,
      async resolve() {
        try {
          const result = await deleteAllUsers();
          return result.message;
        } catch (err) {
          throw new Error(`${(err as Error).message}`);
        }
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
      },
      resolve(parent, args) {
        return createTask({
          title: args.title,
          description: args.description,
          status: args.status,
          assignedTo: args.assignedTo,
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
      },
      resolve(parent, args) {
        return updateTask({
          id: args.id,
          title: args.title,
          description: args.description,
          status: args.status,
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
