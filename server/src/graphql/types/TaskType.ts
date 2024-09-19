import { GraphQLObjectType, GraphQLID, GraphQLString } from "graphql";
import UserType from "./UserType";
import User from "../../models/userModel";

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
    createdAt: { type: GraphQLString },
    finishedBy: {
      type: UserType,
      resolve(parent) {
        return User.findById(parent.finishedBy);
      },
    },
  }),
});

export default TaskType;
