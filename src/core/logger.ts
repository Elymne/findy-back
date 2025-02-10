import * as fs from "fs";

export class Logger {
    private fd: number;

    private static instance: Logger;

    private constructor() {}

    public static getInstance(): Logger {
        if (this.instance == undefined) {
            this.instance = new Logger();
        }
        return this.instance;
    }

    public trace(message: string, ...optionalParams: unknown[]): void {
        this.updateFileDate();
        this.append("TRACE", this.buildMessage(message, optionalParams));
    }

    public debug(message: string, ...optionalParams: unknown[]): void {
        this.updateFileDate();
        this.append("DEBUG", this.buildMessage(message, optionalParams));
    }

    public info(message: string, ...optionalParams: unknown[]): void {
        this.updateFileDate();
        this.append("INFO ", this.buildMessage(message, optionalParams));
    }

    public warn(message: string, ...optionalParams: unknown[]): void {
        this.updateFileDate();
        this.append("WARN ", this.buildMessage(message, optionalParams));
    }

    public error(message: string, ...optionalParams: unknown[]): void {
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

    private buildMessage(message: string, optionalParams?: unknown[]): string {
        if (process.env.NODE_ENV == "development") {
            console.log(message);
            console.log(optionalParams);
        }

        return `${message.toString()} ${JSON.stringify(optionalParams)}`;
    }
}
