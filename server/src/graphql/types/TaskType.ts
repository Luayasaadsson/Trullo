import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from "graphql";
import UserType from "./UserType";
import User from "../../models/userModel";
import ProjectType from "./ProjectType";
import Project from "../../models/projectModel";

const TaskType = new GraphQLObjectType({
  name: "Task",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    assignedTo: {
      type: UserType,
      resolve(parent) {
        return User.findById(parent.assignedTo);
      },
    },
    finishedBy: {
      type: UserType,
      resolve(parent) {
        return User.findById(parent.finishedBy);
      },
    },
    createdAt: { type: GraphQLString },
    project: {
      type: ProjectType,
      resolve(parent) {
        return Project.findById(parent.project);
      },
    },
    tags: { type: new GraphQLList(GraphQLString) },
  }),
});

export default TaskType;
