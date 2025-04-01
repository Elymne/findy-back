import { createPool } from "mysql2" // do not use 'mysql2/promises'!
import { Kysely, MysqlDialect } from "kysely"
import ZoneTable from "../tables/zone_table"
import JobTable from "../tables/job_table"
import CompanyTable from "../tables/company_table"
import OfferTable from "../tables/offer_table"

interface Database {
    zone: ZoneTable
    job: JobTable
    company: CompanyTable
    offer: OfferTable
}

const dialect = new MysqlDialect({
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
})

const db = new Kysely<Database>({
    dialect,
})

export default db
