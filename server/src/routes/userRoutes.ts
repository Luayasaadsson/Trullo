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
import { check, validationResult } from "express-validator";
import authenticate from "../middleware/auth";
import authorizeRole from "../middleware/roleAuthorization";
import { AuthenticatedRequest } from "../middleware/auth";

const router = express.Router();

// Route for registering a new user
router.post(
  "/register",
  [
    check("name").not().isEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Enter a valid email"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    const userRole = role || "user";

    try {
      const newUser = await createUser({
        name,
        email,
        password,
        role: userRole,
      });
      res.json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

// Route for logging in
router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Enter a valid email"),
    check("password").not().isEmpty().withMessage("Password is required"),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const { token, user } = await loginUser(email, password);
      res.json({ token, user });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

// Route for getting all users (authenticated users only)
router.get(
  "/users",
  authenticate,
  async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const users = await getUsers();
      res.json(users);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

// Route for getting a user based on ID (authenticated users only)
router.get(
  "/users/:id",
  authenticate,
  async (req: AuthenticatedRequest, res: express.Response) => {
    const { id } = req.params;
    try {
      const user = await getUserById(id);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

// Route for updating a user based on ID (authenticated users with admin role only)
router.put(
  "/users/:id",
  authenticate,
  authorizeRole(["admin"]), // Only users with 'admin' role can update
  [
    check("name").not().isEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Enter a valid email"),
    check("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req: AuthenticatedRequest, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, email, password } = req.body;
    try {
      const updatedUser = await updateUser({ id, name, email, password });
      res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

// Route for deleting a user based on ID (authenticated users with admin role only)
router.delete(
  "/users/:id",
  authenticate,
  authorizeRole(["admin"]),
  async (req: AuthenticatedRequest, res: express.Response) => {
    const { id } = req.params;
    try {
      const deletedUser = await deleteUser(id);
      res.json({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

// Route for deleting all users (authenticated users with admin role only)
router.delete(
  "/users",
  authenticate,
  authorizeRole(["admin"]),
  async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const result = await deleteAllUsers();
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

// Route for requesting password reset
router.post(
  "/request-reset",
  async (req: express.Request, res: express.Response) => {
    const { email } = req.body;
    try {
      await requestPasswordReset(email);
      res.json({ message: "Reset token sent to email" });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

// Route for resetting password with a reset token
router.post(
  "/reset-password",
  [
    check("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, newPassword } = req.body;
    try {
      await resetPassword(token, newPassword);
      res.json({ message: "Your password has been changed successfully" });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

export default router;
