/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Logger } from "ts-log";
import * as fs from "fs";

class CustomLogger implements Logger {
    private fd: number;

    public trace(message?: any, ...optionalParams: any[]): void {
        this.updateFileDate();
        this.append("TRACE", this.buildMessage(message, optionalParams));
    }

    public debug(message?: any, ...optionalParams: any[]): void {
        this.updateFileDate();
        this.append("DEBUG", this.buildMessage(message, optionalParams));
    }

    public info(message?: any, ...optionalParams: any[]): void {
        this.updateFileDate();
        this.append("INFO ", this.buildMessage(message, optionalParams));
    }

    public warn(message?: any, ...optionalParams: any[]): void {
        this.updateFileDate();
        this.append("WARN ", this.buildMessage(message, optionalParams));
    }

    public error(message?: any, ...optionalParams: any[]): void {
        this.updateFileDate();
        this.append("ERROR", this.buildMessage(message, optionalParams));
    }

    private append(type: string, message: string): void {
        if (process.env.NODE_ENV == "test") {
            return;
        }
        fs.writeSync(this.fd, `${new Date().toISOString()} ${type} ${message}\n`);
    }

    private updateFileDate(): void {
        if (process.env.NODE_ENV == "test") {
            return;
        }

        const today = new Date(Date.now());
        const folderName = "logs";
        const filename = `${folderName}/${today.getFullYear()}-${today.getMonth()}-${today.getDate()}.log`;

        if (fs.existsSync(folderName) == false) {
            fs.mkdirSync(folderName);
        }

        this.fd = fs.openSync(filename, "a");
    }

    private buildMessage(message?: any, optionalParams?: any[]): string {
        if (process.env.NODE_ENV == "development") {
            console.log(message);
            console.log(optionalParams);
        }
        return `${message.toString()} ${JSON.stringify(optionalParams)}`;
    }
}

const logger: CustomLogger = new CustomLogger();

export default logger;
