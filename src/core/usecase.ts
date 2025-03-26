import { Result } from "./Result"

export abstract class Usecase<D, P> {
    public abstract perform(params: P): Promise<Result<D>>
}

export abstract class UsecaseNoParams<D> {
    public abstract perform(): Promise<Result<D>>
}
