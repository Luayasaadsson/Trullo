import { GraphQLObjectType, GraphQLID, GraphQLString } from "graphql";

const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    createdAt: { type: GraphQLString },
  }),
});

export default ProjectType;
