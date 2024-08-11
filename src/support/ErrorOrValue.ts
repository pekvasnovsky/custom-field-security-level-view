export class ErrorSimpleAndFull {
  private _errorSimple?: string;
  private _errorFull?: string;

  protected constructor(errorSimple?: string, errorFull?: string) {
    this._errorSimple = errorSimple;
    this._errorFull = errorFull;
  }

  public isError(): boolean {
    return this._errorFull !== undefined;
  }

  public get errorSimple(): string {
    if (this.isError()) {
      return this._errorSimple!;
    } else {
      throw Error("Not error value");
    }
  }

  public get errorFull(): string {
    if (this.isError()) {
      return this._errorFull!;
    } else {
      throw Error("Not error value");
    }
  }
}

export class ErrorOrValue<T> extends ErrorSimpleAndFull {
  private _value?: T;

  public static createFromObject<V>(obj: object) {
    const result = new ErrorOrValue<V>(undefined, undefined, undefined);
    Object.assign(result, obj);
    return result;
  }

  public static createFromValue<V>(value: V): ErrorOrValue<V> {
    return new ErrorOrValue<V>(value, undefined, undefined);
  }

  public static createFromError<V>(
    errorSimple: string,
    errorFull: string,
  ): ErrorOrValue<V> {
    return new ErrorOrValue<V>(undefined, errorSimple, errorFull);
  }

  public static createFromErrorOther<V>(
    other: ErrorSimpleAndFull,
  ): ErrorOrValue<V> {
    return new ErrorOrValue<V>(undefined, other.errorSimple, other.errorFull);
  }

  protected constructor(value?: T, errorSimple?: string, errorFull?: string) {
    super(errorSimple, errorFull);
    this._value = value;
  }

  public get value(): T {
    if (!this.isError()) {
      return this._value!;
    } else {
      throw Error("Is error value");
    }
  }
}
