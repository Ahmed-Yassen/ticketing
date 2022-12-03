import { CustomException } from "./custom-exception";

export class NotAuthorizedException extends CustomException {
  statusCode = 401;

  constructor() {
    super("Not Authorized");

    Object.setPrototypeOf(this, NotAuthorizedException.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [
      {
        message: "Not Authorized",
      },
    ];
  }
}
