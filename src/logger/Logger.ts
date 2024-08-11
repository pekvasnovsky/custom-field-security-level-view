const PREFIX = "custom-field-security-level-view: ";

export class Logger {
  public static logError(
    message?: unknown,
    ...optionalParams: unknown[]
  ): void {
    console.error(PREFIX + message, ...optionalParams);
  }
}
