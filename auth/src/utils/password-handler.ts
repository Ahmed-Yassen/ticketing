import bcrypt from "bcrypt";

export class PasswordHandler {
  static hash(plainTextPassword: string) {
    return bcrypt.hash(plainTextPassword, 10);
  }

  static compare(plainTextPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
