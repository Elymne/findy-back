import { Logger } from "./Logger"

export interface Params {}

export abstract class Usecase<D, P extends Params> {
    public abstract perform(params: P): Promise<Result<D>>
}

export abstract class UsecaseNoParams<D> {
    public abstract perform(): Promise<Result<D>>
}

export class Result<D> {
    logMessage: string
    code: number
    type: ResultType
    data: D | null
    exception: unknown | null

    constructor(type: ResultType, code: number, logMessage: string, data: D | null, exception: unknown | null) {
        this.type = type
        this.code = code
        this.logMessage = logMessage
        this.data = data
        this.exception = exception

        if (this.type == ResultType.FAILURE) {
            Logger.getInstance().error(this.logMessage, this.exception)
            return
        }
        Logger.getInstance().info(this.logMessage, this.data)
    }
}

export enum ResultType {
    SUCCESS,
    FAILURE,
}
