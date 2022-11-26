export abstract class CustomException extends Error {
  constructor(exceptionMessage: string) {
    super(exceptionMessage);
    Object.setPrototypeOf(this, CustomException.prototype);
  }

  abstract statusCode: number;
  abstract serializeErrors(): { message: string; field?: string }[];
}
