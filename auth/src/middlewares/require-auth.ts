import { NextFunction, Request, Response } from "express";
import { NotAuthorizedException } from "../errors/not-authorized-exception";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user";
import { NotFoundException } from "../errors/not-found-exception";

interface UserPayload extends JwtPayload {
  id: number;
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.Authentication;
  if (!token) throw new NotAuthorizedException();

  const decodedToken = jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as UserPayload;
  const user = await User.findById(decodedToken.id);
  if (!user) throw new NotFoundException("User");

  req.user = user;
  next();
};
