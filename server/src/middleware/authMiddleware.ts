import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string | null;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  let user: JwtPayload | string | null = null;

  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = user;
      console.log("Decoded user:", user);
    } catch (error) {
      console.log("Invalid token:", (error as Error).message);
    }
  } else {
    console.log("No token provided");
  }

  next();
};
