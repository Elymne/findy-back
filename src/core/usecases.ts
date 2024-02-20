export abstract class Result<T> {}

export class Success<T> extends Result<T> {
  value: T;

  constructor(value: T) {
    super();
    this.value = value;
  }
}

export class Failure<T> extends Result<T> {
  error: T;

  constructor(error: T) {
    super();
    this.error = error;
  }
}
