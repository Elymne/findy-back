import { createPool } from "mysql2" // do not use 'mysql2/promises'!
import { Kysely, MysqlDialect } from "kysely"
import mysql from "mysql2/promise"
import ZoneTable from "../tables/zone_table"
import JobTable from "../tables/job_table"
import CompanyTable from "../tables/company_table"
import OfferTable from "../tables/offer_table"
import IDatabase from "@App/domain/gateways/IDatabase.gateways"
import { createNoExistsCompany, createNoExistsJob, createNoExistsOffer, createNoExistsZone } from "./createNoExists"
import { createOrReplaceCompany, createOrReplaceJob, createOrReplaceOffer, createOrReplaceZone } from "./createOrReplace"

export interface Database {
    zone: ZoneTable
    job: JobTable
    company: CompanyTable
    offer: OfferTable
}

export default class KyselyDatabase implements IDatabase {
    private _quickConnec: mysql.Connection
    private _connec: Kysely<Database>
    public get connec() {
        return this._connec
    }

    private static _instance: KyselyDatabase
    public static get get() {
        if (!KyselyDatabase._instance) {
            KyselyDatabase._instance = new KyselyDatabase()
        }
        return KyselyDatabase._instance
    }

    private constructor() {}

    public async startConnec(): Promise<void> {
        this._connec = new Kysely<Database>({
            dialect: new MysqlDialect({
                pool: createPool({
                    host: process.env.DB_HOST,
                    database: process.env.DB_DATABASE,
                    port: parseInt(process.env.DB_PORT!),
                    user: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD,

                    connectionLimit: 10,
                    waitForConnections: true,
                    multipleStatements: true,
                }),
            }),
        })
    }

    private async quickConnection(): Promise<void> {
        const options = {
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            port: parseInt(process.env.DB_PORT!),
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,

            connectionLimit: 1,
            waitForConnections: true,
            multipleStatements: true,
        }
        this._quickConnec = await mysql.createConnection(options)
    }

    private async quickLogout(): Promise<void> {
        return new Promise((res) => {
            res(this._quickConnec.destroy())
        })
    }

    public async check(): Promise<void> {
        await this.quickConnection()
        await Promise.all([this._quickConnec.query(createNoExistsJob), this._quickConnec.query(createNoExistsCompany), this._quickConnec.query(createNoExistsZone)])
        await this._quickConnec.query(createNoExistsOffer)
        this.quickLogout()
    }

    public async reset(): Promise<void> {
        await this.quickConnection()
        await Promise.all([this._quickConnec.query(createOrReplaceJob), this._quickConnec.query(createOrReplaceCompany), this._quickConnec.query(createOrReplaceZone)])
        await this._quickConnec.query(createOrReplaceOffer)
        this.quickLogout()
    }
}
