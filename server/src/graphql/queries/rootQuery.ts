import UserType from "../types/UserType";
import TaskType from "../types/TaskType";
import ProjectType from "../types/ProjectType";
import { GraphQLObjectType, GraphQLList, GraphQLID } from "graphql";
import { getUsers, getUserById } from "./../../resolvers/userResolver";
import { getTasks, getTaskById } from "./../../resolvers/taskResolver";
import { getProjects, getProjectById } from "../../resolvers/projectResolver";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // User queries
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args, context) {
        return getUsers(context);
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args, context) {
        return getUserById(args.id, context);
      },
    },

    // Project queries
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args, context) {
        return getProjects(context);
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args, context) {
        return getProjectById(args.id, context);
      },
    },

    // Task queries
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args, context) {
        return getTasks(context);
      },
    },
    task: {
      type: TaskType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args, context) {
        return getTaskById(args.id, context);
      },
    },
  },
});

export default RootQuery;
