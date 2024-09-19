import User from "../models/userModel";
import { hashPassword } from "./../utils/passwordUtils";
import { isValidObjectId } from "../utils/idValidationUtils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Get all users
export const getUsers = async () => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      throw new Error("No users found");
    }
    return users;
  } catch (error) {
    throw new Error(`Failed to fetch users: ${(error as Error).message}`);
  }
};

// Get a user by specific ID
export const getUserById = async (id: string) => {
  try {
    // Validate that the ID has the correct format
    if (!isValidObjectId(id)) {
      throw new Error("Invalid user ID format");
    }

    const user = await User.findById(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return user;
  } catch (error) {
    throw new Error(`Failed to fetch user: ${(error as Error).message}`);
  }
};

// Create a new user
export const createUser = async (args: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  try {
    // Validate that none of the fields are empty
    if (!args.name || !args.email || !args.password) {
      throw new Error("Name, email, and password are required");
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email: args.email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash the password
    const hashedPassword = await hashPassword(args.password);

    // Create the user with the hashed password
    const newUser = new User({
      name: args.name,
      email: args.email,
      password: hashedPassword,
      role: args.role,
    });
    return await newUser.save();
  } catch (error) {
    throw new Error(`Failed to create user: ${(error as Error).message}`);
  }
};

// Update an existing user
export const updateUser = async (args: {
  id: string;
  name?: string;
  email?: string;
  password?: string;
}) => {
  try {
    // Validate that the ID has the correct format
    if (!isValidObjectId(args.id)) {
      throw new Error("Invalid user ID format");
    }

    // Check if the user exists
    const user = await User.findById(args.id);
    if (!user) {
      throw new Error(`User with ID ${args.id} not found`);
    }

    // Check that both name and email are filled
    if (!args.name || args.name.trim() === "") {
      throw new Error("Name is required");
    }
    if (!args.email || args.email.trim() === "") {
      throw new Error("Email is required");
    }
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email)) {
      throw new Error("Invalid email format");
    }
    // Check that the email address is not used by another user
    const existingUser = await User.findOne({ email: args.email });
    if (existingUser && existingUser._id.toString() !== args.id) {
      throw new Error("Email is already in use by another user");
    }

    let hashedPassword;
    if (args.password) {
      hashedPassword = await hashPassword(args.password);
    }

    // Prepare fields for update
    const updateFields: any = { name: args.name, email: args.email };
    if (hashedPassword) updateFields.password = hashedPassword;

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(args.id, updateFields, {
      new: true,
    });
    return updatedUser;
  } catch (error) {
    throw new Error(`Failed to update user: ${(error as Error).message}`);
  }
};

// Delete a user
export const deleteUser = async (id: string) => {
  try {
    // Validate that the ID has the correct format
    if (!isValidObjectId(id)) {
      throw new Error("Invalid user ID format");
    }
    // Check if the user exists before deleting
    const user = await User.findById(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    return await User.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Failed to delete user: ${(error as Error).message}`);
  }
};

// Delete all users
export const deleteAllUsers = async () => {
  try {
    // Check if there are any users in the database
    const users = await User.find();
    if (!users || users.length === 0) {
      throw new Error("No users to delete");
    }

    // Delete all users
    const result = await User.deleteMany({});
    if (result.deletedCount === 0) {
      throw new Error("Failed to delete users");
    }

    return { message: `${result.deletedCount} users deleted` };
  } catch (error) {
    throw new Error(`Failed to delete all users: ${(error as Error).message}`);
  }
};

// Login user
export const loginUser = async (email: string, password: string) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    return { token, user };
  } catch (error) {
    throw new Error(`Login failed: ${(error as Error).message}`);
  }
};

// Request password reset
export const requestPasswordReset = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User with this email does not exist");
  }

  // Generera reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpiry = new Date(Date.now() + 3600000);
  await user.save();

  console.log(`Reset token for ${email}: ${resetToken}`);
};

// Reset password
export const resetPassword = async (token: string, newPassword: string) => {
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  user.password = (await hashPassword(newPassword)) || "";
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();
};
