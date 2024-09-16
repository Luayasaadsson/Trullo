import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const connectDB = async () => {
  try {
    const DB = (process.env.DATABASE as string)
      .replace("<db_PASSWORD>", process.env.DATABASE_PASSWORD as string)
      .replace("<db_NAME>", process.env.DB_NAME as string);

    // Connect to MongoDB
    await mongoose.connect(DB);

    console.log(`MongoDB connected successfully to ${process.env.DB_NAME}`);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
