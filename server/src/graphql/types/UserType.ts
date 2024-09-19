import { GraphQLObjectType, GraphQLID, GraphQLString } from "graphql";

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    role: { type: GraphQLString },
  }),
});

export default UserType;
