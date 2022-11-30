export class EnvMissingException extends Error {
  constructor(env: string) {
    super(`ENV is Missing: ${env}`);

    Object.setPrototypeOf(this, EnvMissingException.prototype);
  }
}
