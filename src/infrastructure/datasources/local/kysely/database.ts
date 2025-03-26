import { Kysely, MysqlDialect } from "kysely"
import { createPool } from "mysql2" // do not use 'mysql2/promises'!
import LastScrapDateTable from "./tables/LastScrapDate.table"
import OfferTable from "./tables/offer.table"
import SchoolTable from "./tables/school.table"

interface Database {
    offer: OfferTable
    school: SchoolTable
    last_scrap_date: LastScrapDateTable
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

export const database = new Kysely<Database>({
    dialect,
})
