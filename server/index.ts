import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import connectDB from "./src/db/db";
import schema from "./src/graphql/schema";
import userRoutes from "./src/routes/userRoutes";
import authMiddleware from "./src/middleware/auth";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5005;

// Connect to MongoDB
connectDB();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.use("/users", authMiddleware, userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
