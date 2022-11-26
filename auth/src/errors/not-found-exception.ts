import { CustomException } from "./custom-exception";

export class NotFoundException extends CustomException {
  statusCode = 404;

  constructor(private resource: string) {
    super(`${resource} Not Found`);

    Object.setPrototypeOf(this, NotFoundException.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: `${this.resource} Not Found` }];
  }
}
