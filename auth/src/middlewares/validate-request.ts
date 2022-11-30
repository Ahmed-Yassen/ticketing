import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationException } from "../errors/request-validation-exception";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new RequestValidationException(errors.array());

  next();
};
