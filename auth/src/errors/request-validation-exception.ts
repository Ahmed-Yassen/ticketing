import { CustomException } from "./custom-exception";
import { ValidationError } from "express-validator";

export class RequestValidationException extends CustomException {
  statusCode = 400;

  constructor(private errors: ValidationError[]) {
    super("Invalid request parameters");

    Object.setPrototypeOf(this, RequestValidationException.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}
