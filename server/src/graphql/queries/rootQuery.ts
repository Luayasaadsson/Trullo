import UserType from "../types/UserType";
import TaskType from "../types/TaskType";
import ProjectType from "../types/ProjectType";
import Project from "../../models/projectModel";
import { GraphQLObjectType, GraphQLList, GraphQLID } from "graphql";
import { getUsers, getUserById } from "./../../resolvers/userResolver";
import { getTasks, getTaskById } from "./../../resolvers/taskResolver";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // User queries
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return getUsers();
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return getUserById(args.id);
      },
    },

    // Project queries
    projects: {
      type: new GraphQLList(ProjectType),
      resolve() {
        return Project.find();
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Project.findById(args.id);
      },
    },

    // Task queries
    tasks: {
      type: new GraphQLList(TaskType),
      resolve() {
        return getTasks();
      },
    },
    task: {
      type: TaskType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return getTaskById(args.id);
      },
    },
  },
});

export default RootQuery;
