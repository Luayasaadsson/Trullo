import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const validateEnvVars = () => {
  const requiredVars = ["DATABASE", "DATABASE_PASSWORD", "DB_NAME"];

  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  });

  if (
    !process.env.DATABASE!.includes("<db_PASSWORD>") ||
    !process.env.DATABASE!.includes("<db_NAME>")
  ) {
    throw new Error(
      "DATABASE connection string format is incorrect. Ensure it includes <db_PASSWORD> and <db_NAME> placeholders."
    );
  }
};

const connectDB = async () => {
  try {
    // Validate environment variables
    validateEnvVars();

    // Replace placeholders in the DATABASE string
    const DB = process.env
      .DATABASE!.replace("<db_PASSWORD>", process.env.DATABASE_PASSWORD!)
      .replace("<db_NAME>", process.env.DB_NAME!);

    // Validate that the DB string is not empty after replacements
    if (!DB) {
      throw new Error("DB string is empty after replacements");
    }

    // Connect to MongoDB
    await mongoose.connect(DB);
    console.log(`MongoDB connected successfully to ${process.env.DB_NAME}`);
  } catch (err) {
    console.error("Error connecting to MongoDB:", (err as Error).message);
  }
};

export default connectDB;
