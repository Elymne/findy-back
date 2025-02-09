export interface Usecase<D, P> {
    perform(params: P): Promise<Result<D>>;
}

export interface UsecaseNoParams<D> {
    perform(): Promise<Result<D>>;
}

export interface Result<D> {
    logMessage: string;
    type: ResultType;
    data: D | null;
    exception: unknown | null;
}

export enum ResultType {
    SUCCESS,
    FAILURE,
}
