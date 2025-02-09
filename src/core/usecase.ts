import logger from "./logger";

export interface Usecase<D, P> {
    perform(params: P): Promise<Result<D>>;
}

export interface UsecaseNoParams<D> {
    perform(): Promise<Result<D>>;
}

export class Result<D> {
    logMessage: string;
    code: number;
    type: ResultType;
    data: D | null;
    exception: unknown | null;

    constructor(type: ResultType, code: number, logMessage: string, data: D | null, exception: unknown | null) {
        this.type = type;
        this.code = code;
        this.logMessage = logMessage;
        this.data = data;
        this.exception = exception;

        if (this.type == ResultType.FAILURE) {
            logger.error(this.logMessage, this.exception);
            return;
        }

        logger.info(this.logMessage, this.data);
    }
}

export enum ResultType {
    SUCCESS,
    FAILURE,
}
