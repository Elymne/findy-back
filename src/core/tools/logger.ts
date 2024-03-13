/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Logger } from "ts-log"
import * as fs from "fs"

class CustomLogger implements Logger {
    private fd: number
    private currentFileName: string

    public constructor() {}

    public trace(message?: any, ...optionalParams: any[]): void {
        this.updateFileDate()
        this.append("TRACE", `${message} ${JSON.stringify(optionalParams)}`)
    }

    public debug(message?: any, ...optionalParams: any[]): void {
        this.updateFileDate()
        this.append("DEBUG", `${message} ${JSON.stringify(optionalParams)}`)
    }

    public info(message?: any, ...optionalParams: any[]): void {
        this.updateFileDate()
        this.append("INFO ", `${message} ${JSON.stringify(optionalParams)}`)
    }

    public warn(message?: any, ...optionalParams: any[]): void {
        this.updateFileDate()
        this.append("WARN ", `${message} ${JSON.stringify(optionalParams)}`)
    }

    public error(message?: any, ...optionalParams: any[]): void {
        this.updateFileDate()
        this.append("ERROR", `${message.toString()} ${JSON.stringify(optionalParams)}`)
        if (process.env.NODE_ENV == "development") {
            console.log(message)
            // console.log(optionalParams)
        }
    }

    private updateFileDate(): void {
        const today = new Date(Date.now())
        const folderName = "logs"
        const filename = `${folderName}/${today.getFullYear()}-${today.getMonth()}-${today.getDate()}.log`
        if (this.currentFileName == filename) return

        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName)
        }

        this.fd = fs.openSync(filename, "a")
    }

    private append(type: string, message: string): void {
        fs.writeSync(this.fd, `${new Date().toISOString()} ${type} ${message}\n`)
    }
}

export const logger: CustomLogger = new CustomLogger()
