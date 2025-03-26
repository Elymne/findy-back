import * as fs from "fs"

/**
 * @prop {string} INFO Normal response with no error.
 * @prop {string} WARN Odd response that may indicate that the server has a problem.
 * @prop {string} ERROR A normal error response that may indicate that the problem come from user inputs.
 * @prop {string} CRITICAL An error that should not happen to the server thus it's critical and should be takken serriously.
 */
export enum LoggerType {
    INFO = "INFO",
    WARN = "WARN",

    ERROR = "ERROR",
    CRITICAL = "CRITICAL",
}

/**
 * TODO : Create file for stacktrace from critical errors.
 */
export class Logger {
    private fd: number
    private static instance: Logger
    private constructor() {}

    public static getInstance(): Logger {
        if (this.instance == undefined) {
            this.instance = new Logger()
        }
        return this.instance
    }

    /**
     * The main function to update the current log file.
     * @param {LoggerType} type
     * @param {string} message
     * @param {unknown} details
     */
    public log(type: LoggerType, message: string, details?: unknown): void {
        if (process.env.NODE_ENV == "development") {
            switch (type) {
                case LoggerType.INFO:
                    console.log(FgBlue, message)
                    if (details) console.log(JSON.stringify(details))
                    break
                case LoggerType.WARN:
                    console.log(FgYellow, message)
                    if (details) console.warn(JSON.stringify(details))
                    break
                case LoggerType.ERROR:
                    console.log(FgMagenta, message)
                    if (details) console.log(details)
                    break
                case LoggerType.CRITICAL:
                    console.log(FgRed, message)
                    if (details) console.error(details)
                    break
            }
        }

        this.manageLogFiles()
        fs.writeSync(this.fd, `${new Date().toISOString()} ${type} : ${message}\n`)
    }

    /**
     * Define our pointer @prop {number} fd to point to current log file.
     * If the folder Logs doesn't exists, we simply create it.
     * If the file name isn't found, we create it.
     * A file is composed of the date of the day in the format YYYY-MM-DD.
     */
    private manageLogFiles(): void {
        const today = new Date(Date.now())
        const folderName = "logs"
        const filename = `${folderName}/${today.getFullYear()}-${today.getMonth()}-${today.getDate()}.log`

        if (fs.existsSync(folderName) == false) {
            fs.mkdirSync(folderName)
        }
        this.fd = fs.openSync(filename, "a")
    }
}

const FgRed = "\x1b[31m"
const FgYellow = "\x1b[33m"
const FgBlue = "\x1b[34m"
const FgMagenta = "\x1b[35m"

// const FgBlack = "\x1b[30m"
// const FgGreen = "\x1b[32m"
// const FgCyan = "\x1b[36m"
// const FgWhite = "\x1b[37m"
// const FgGray = "\x1b[90m"
