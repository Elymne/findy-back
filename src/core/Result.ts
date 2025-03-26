import { Logger, LoggerType } from "./Logger"

/**
 * Result are data type returned by my usecases.
 * Usecases can only return this type of data.
 * Response from API should manage this type of data.
 */
export type Result<T = void, E = unknown, S = unknown> = Failure<E, S> | Success<T>

/**
 * @param {number} code HTTP code or 0/1 for none http request.
 * @param {string} message Simple log message
 * @param {T} data  Value returned by server
 * @param {SuccessType} type Allow us to know if the result is normal or a bit odd and should'nt happen.
 * @returns {Success} Return a Success Result
 */
export function succeed<T = void>(code: number, message: string, data: T, type: SuccessType = SuccessType.NORMAL): Success<T> {
    switch (type) {
        case SuccessType.NORMAL:
            Logger.getInstance().log(LoggerType.INFO, message)
            break
        case SuccessType.WARNING:
            Logger.getInstance().log(LoggerType.WARN, message)
            break
    }
    return {
        _tag: "Success",
        code: code,
        message: message,
        data: data,
    }
}

export type Success<T = void> = {
    _tag: "Success"
    code: number
    message: string
    data: T
}
export enum SuccessType {
    NORMAL,
    WARNING,
}

/**
 * @param {number} code HTTP code or 0/1 for none http request.
 * @param {string} message Simple log message
 * @param {E} error  Value returned by server
 * @param {S} stacktrace Unexpected error (internal error from server) from a try catch or a specific behavior that should not happen when using a usecase.
 * @returns {Failure} Return a Failure Result
 */
export function failed<E = unknown, S = unknown>(code: number, message: string, error: E, stacktrace?: S): Failure<E, S> {
    if (stacktrace) {
        Logger.getInstance().log(LoggerType.CRITICAL, message, stacktrace)
    } else {
        Logger.getInstance().log(LoggerType.ERROR, message)
    }
    return {
        _tag: "Failure",
        code: code,
        message: message,
        error: error,
        stacktrace: stacktrace,
    }
}

type Failure<E = unknown, S = unknown> = {
    _tag: "Failure"
    code: number
    message: string
    error: E
    stacktrace?: S
}
