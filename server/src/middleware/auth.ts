import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthenticatedRequest extends Request {
  user?: User;
}

const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as User;
    req.user = decoded;

    // Check admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticate;
