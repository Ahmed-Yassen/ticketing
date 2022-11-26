import { NextFunction, Request, Response } from "express";
import { CustomException } from "../errors/custom-exception";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`${new Date().toLocaleString()} : ${error.message}`);

  if (error instanceof CustomException) {
    return res.status(error.statusCode).send(error.serializeErrors());
  }

  return res.status(500).send({
    errors: [{ message: "An unexpected error occured, check server logs" }],
  });
};
