import express from "express";
import {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  deleteAllUsers,
  requestPasswordReset,
  resetPassword,
} from "./../resolvers/userResolver";

const router = express.Router();

// Route for registering a new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = await createUser({ name, email, password });
    res.json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route for logging in
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { token, user } = await loginUser(email, password);
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route for getting all users
router.get("/users", async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route for getting a user based on ID
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route for updating a user based on ID
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    const updatedUser = await updateUser({ id, name, email, password });
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route for deleting a user based on ID
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await deleteUser(id);
    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route for deleting all users
router.delete("/users", async (req, res) => {
  try {
    const result = await deleteAllUsers();
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route for requesting password reset
router.post("/request-reset", async (req, res) => {
  const { email } = req.body;
  try {
    await requestPasswordReset(email);
    res.json({ message: "Reset token sent to email" });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route for resetting password with a reset token
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    await resetPassword(token, newPassword);
    res.json({ message: "Your password has been changed successfully" });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
