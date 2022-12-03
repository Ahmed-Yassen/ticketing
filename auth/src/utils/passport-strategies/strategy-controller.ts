import { NextFunction, Request, Response } from "express";
import { UserAttributes } from "../../models/user";
import { getCookieWithJwt } from "../helperFunctions";

export interface UserProfile extends UserAttributes {
  id: number;
}

export const strategyController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user as UserProfile;
  res.setHeader("Set-Cookie", getCookieWithJwt(id));
  res.send(req.user);
};
