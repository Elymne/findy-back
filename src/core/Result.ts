import { Logger, LoggerType } from "./Logger"

export enum SuccessType {
    NORMAL,
    WARNING,
}

/**
 * Base class for any response from a usecase.
 * @prop {number} code HTTP code or 0/1 for none http request.
 * @prop {string} message Simple log message
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class Result<T = void> {
    readonly code: number
    readonly message: string

    protected constructor(code: number, message: string) {
        this.code = code
        this.message = message
    }
}

/**
 * Success response from a usecase.
 * @param {number} code HTTP code or 0/1 for none http request.
 * @param {string} message Simple log message
 * @param {T} data  Value returned by server
 * @param {SuccessType} type Allow us to know if the result is normal or a bit odd and should'nt happen.
 */
export class Success<T> extends Result<T> {
    readonly data: T

    public constructor(code: number, message: string, data: T, type: SuccessType = SuccessType.NORMAL) {
        super(code, message)
        this.data = data

        switch (type) {
            case SuccessType.NORMAL:
                Logger.getInstance().log(LoggerType.INFO, message)
                break
            case SuccessType.WARNING:
                Logger.getInstance().log(LoggerType.WARN, message)
                break
        }
    }
}

/**
 * Failure response from a usecase
 * @param {number} code HTTP code or 0/1 for none http request.
 * @param {string} message Simple log message
 * @param {E} error  Value returned by server
 * @param {S} stacktrace Unexpected error (internal error from server) from a try catch or a specific behavior that should not happen when using a usecase.
 */
export class Failure extends Result<void> {
    readonly error: unknown
    readonly stacktrace?: unknown

    public constructor(code: number, message: string, error: unknown, stacktrace?: unknown) {
        super(code, message)
        this.error = error
        this.stacktrace = stacktrace

        if (stacktrace) {
            Logger.getInstance().log(LoggerType.CRITICAL, message, stacktrace)
        } else {
            Logger.getInstance().log(LoggerType.ERROR, message)
        }
    }
}
