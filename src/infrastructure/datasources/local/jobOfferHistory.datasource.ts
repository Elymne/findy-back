import { DBDataSource } from "~/core/databases/database.datasource"
import { PgClient } from "~/core/databases/pgClient"
import { uuid } from "~/core/tools/uuid"
import { JobOfferHistory, JobOfferSource } from "~/domain/entities/databases/jobOfferHistory"

export interface JobOfferHistoryDatasource extends DBDataSource<JobOfferHistory> {
    findAllBySource: (source: JobOfferSource) => Promise<JobOfferHistory[]>
}

export const JobOfferHistoryDatasourceImpl: JobOfferHistoryDatasource = {
    tableName: "job_offer_history",

    findOne: async function (id: string): Promise<JobOfferHistory[]> {
        const query = `SELECT * FROM ${this.tableName} WHERE id = $1`
        const res = await PgClient.getInstance().getClient().query<JobOfferHistory>(query, [id])
        return [...res]
    },

    findAll: async function (): Promise<JobOfferHistory[]> {
        const query = `SELECT * FROM ${this.tableName}`
        const res = await PgClient.getInstance().getClient().query<JobOfferHistory>(query, [])
        return [...res]
    },

    addOne: async function (school: JobOfferHistory): Promise<number> {
        const query = `INSERT INTO ${this.tableName} (id,source,is_banned,source_id,source_url) VALUES (default,$1,$2,$3,$4);`
        await PgClient.getInstance()
            .getClient()
            .query<JobOfferHistory>(query, [school.source, school.is_banned, school.source_id ?? "default", school.source_url ?? "default"])
        return 1
    },

    addMany: async function (schools: JobOfferHistory[]): Promise<number> {
        if (schools.length == 0) return 0

        let query = `INSERT INTO ${this.tableName} (id,source,is_banned,source_id,source_url) VALUES `
        const values = []
        let index = 1
        for (const school of schools) {
            query += `($${index}`
            index++
            values.push(uuid)

            query += `,$${index}`
            index++
            values.push(school.source)

            query += `,$${index}`
            index++
            values.push(school.is_banned)

            query += `,$${index}`
            index++
            values.push(school.source_id)

            query += `,$${index}),`
            index++
            values.push(school.source_url)
        }

        query = query.substring(0, query.length - 1)
        query += ";"

        console.log(query)

        await PgClient.getInstance().getClient().query<JobOfferHistory>(query, values)
        return schools.length
    },

    deleteOne: function (id: string): Promise<number> {
        throw new Error("Function not implemented.")
    },

    deleteMany: function (ids: string[]): Promise<number> {
        throw new Error("Function not implemented.")
    },

    findAllBySource: async function (source: JobOfferSource): Promise<JobOfferHistory[]> {
        const query = `SELECT * FROM ${this.tableName} WHERE source = $1`
        const res = await PgClient.getInstance().getClient().query<JobOfferHistory>(query, [source])
        return [...res]
    },
}
