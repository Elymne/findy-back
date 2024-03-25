export interface Usecase<R, P> {
    perform: (params: P) => Promise<Result<R>>
}

export interface UsecaseNoParams<R> {
    perform: () => Promise<Result<R>>
}

export abstract class Result<D> {
    public message: string
    public data: D
}

export class Success<D> extends Result<D> {
    constructor(params: { message: string; data: D }) {
        super()
        this.message = params.message
        this.data = params.data
    }
}

export class Failure<D> extends Result<D> {
    public errorCode: number
    constructor(params: { message: string; errorCode: number }) {
        super()
        this.message = params.message
        this.errorCode = params.errorCode
    }
}
