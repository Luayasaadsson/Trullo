import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import connectDB from "./src/db/db";
import schema from "./src/graphql/schema";
import {
  authenticateToken,
  AuthenticatedRequest,
} from "./src/middleware/authMiddleware";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5005;

// Connect to MongoDB
connectDB();

app.use(authenticateToken);

app.use(
  "/graphql",
  graphqlHTTP((req, res) => {
    const authenticatedReq = req as AuthenticatedRequest;

    return {
      schema,
      graphiql: true,
      context: { req: authenticatedReq, res, user: authenticatedReq.user },
    };
  })
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
