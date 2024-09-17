import mongoose from "mongoose";

// Function to validate MongoDB ObjectId
export const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};
