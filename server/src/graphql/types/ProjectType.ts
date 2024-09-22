import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from "graphql";
import Task from "../../models/taskModel";

const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    tasks: {
      type: new GraphQLList(require("./TaskType").default),
      resolve(parent) {
        return Task.find({ project: parent.id });
      },
    },
  }),
});

export default ProjectType;
