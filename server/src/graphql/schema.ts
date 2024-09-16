import { GraphQLSchema } from "graphql";
import RootQuery from "./queries/rootQuery";
import Mutation from "./mutations/mutation";

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
