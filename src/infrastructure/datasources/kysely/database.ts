import { Kysely, MysqlDialect } from "kysely"
import { createPool } from "mysql2" // !do not use 'mysql2/promises'!
import OfferTable from "./tables/Offer.table"
import JobTable from "./tables/Job.table"

interface Database {
    offer: OfferTable
    job: JobTable
}

export class DB {
    readonly connec: Kysely<Database>
    private static instance: DB

    private constructor() {
        const dialect = new MysqlDialect({
            pool: createPool({
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT!),
                database: process.env.DB_DATABASE,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                connectionLimit: 10,
            }),
        })
        this.connec = new Kysely<Database>({
            dialect,
        })
    }

    public static getInstance(): DB {
        if (!DB.instance) {
            DB.instance = new DB()
        }
        return DB.instance
    }
}
