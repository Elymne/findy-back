export interface Usecase<R, P> {
    perform: (params: P) => Promise<Result<R>>
}

export interface UsecaseNoParams<R> {
    perform: () => Promise<Result<R>>
}

export interface Result<D> {
    message: string
    data: D
}

export interface Success<D> extends Result<D> {}

export interface Failure<D> extends Result<D> {
    errorCode: number
}
