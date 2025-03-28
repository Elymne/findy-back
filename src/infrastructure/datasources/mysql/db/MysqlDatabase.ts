import IDatabase from "@App/domain/gateways/IDatabase.gateways"
import mysql from "mysql2/promise"
import queryCheck from "./queryCheck"

export class MysqlDatabase implements IDatabase {
    private connec: mysql.Connection
    private static instance: MysqlDatabase
    private constructor() {}

    public async startConnec(): Promise<void> {
        const options = {
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            port: parseInt(process.env.DB_PORT!),
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,

            connectionLimit: 10,
            waitForConnections: true,
            multipleStatements: true,
        }

        this.connec = await mysql.createPool(options)
    }

    public getConnec(): mysql.Connection {
        return this.connec
    }

    public static getInstance(): MysqlDatabase {
        if (!MysqlDatabase.instance) {
            MysqlDatabase.instance = new MysqlDatabase()
        }
        return MysqlDatabase.instance
    }

    public async check(): Promise<void> {
        if (!this.connec) {
            throw "No connection to Database"
        }
        this.connec.query(queryCheck)
    }

    public async reset(): Promise<void> {
        if (!this.connec) {
            throw "No connection to Database"
        }
        this.connec.query(queryCheck)
    }
}
