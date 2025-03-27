import { Kysely, MysqlDialect } from "kysely"
import { createPool } from "mysql2" // !do not use 'mysql2/promises'!
import OfferTable from "./tables/Offer.table"
import JobTable from "./tables/Job.table"

interface Database {
    offer: OfferTable
    job: JobTable
}

const dialect = new MysqlDialect({
    pool: createPool({
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: 1,
        connectionLimit: 1,
    }),
})

const database = new Kysely<Database>({
    dialect,
})

export default database
