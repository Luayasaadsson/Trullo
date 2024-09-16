import User from "./../models/user";
import { hashPassword } from "./../utils/passwordUtils";

// Get all users
export const getUsers = async () => {
  return await User.find();
};

// Get a user by specific ID
export const getUserById = async (id: string) => {
  return await User.findById(id);
};

// Create a new user
export const createUser = async (args: {
  name: string;
  email: string;
  password: string;
}) => {
  const newUser = new User({ ...args });
  return await newUser.save();
};

// Update an existing user
export const updateUser = async (args: {
  id: string;
  name?: string;
  email?: string;
  password?: string;
}) => {
  if (args.password) {
    args.password = await hashPassword(args.password);
  }
  return await User.findByIdAndUpdate(args.id, { ...args }, { new: true });
};

// Delete a user
export const deleteUser = async (id: string) => {
  return await User.findByIdAndDelete(id);
};
