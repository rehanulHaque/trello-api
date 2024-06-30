import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface CustomRequest extends Request {
    user?: any;
}

export const authMidd = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const validateToken = jwt.verify(token!, process.env.JWT_SECRET!) as any;

    if (!validateToken){
        return res.status(401).json({ message: "Unauthorized" });
    }

    const reqWithUser = req as CustomRequest;
    reqWithUser.user = validateToken.id;

    next();
  } catch (error: any) {
    console.log(error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
