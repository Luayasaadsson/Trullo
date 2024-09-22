import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from "graphql";
import User from "../../models/userModel";
import Project from "../../models/projectModel";

const TaskType = new GraphQLObjectType({
  name: "Task",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    assignedTo: {
      type: require("./UserType").default,
      resolve(parent) {
        return User.findById(parent.assignedTo);
      },
    },
    finishedBy: {
      type: require("./UserType").default,
      resolve(parent) {
        return User.findById(parent.finishedBy);
      },
    },
    createdAt: { type: GraphQLString },
    project: {
      type: require("./ProjectType").default,
      resolve(parent) {
        return Project.findById(parent.project);
      },
    },
    tags: { type: new GraphQLList(GraphQLString) },
  }),
});

export default TaskType;
