import { stat } from "fs/promises"
import { DatabaseDatasource } from "~/core/databases/database.datasource"
import { PgClient } from "~/core/databases/pgClient"
import { JobOfferHistory } from "~/domain/entities/databases/jobOfferHistory"

export interface JobOfferHistoryDatasource extends DatabaseDatasource<JobOfferHistory> {}

export const JobOfferHistoryDatasourceImpl: JobOfferHistoryDatasource = {
    tableName: "job_offer_history",

    findOne: function (id: string): Promise<JobOfferHistory[]> {
        throw new Error("Function not implemented.")
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
        let query = `INSERT INTO ${this.tableName} (id,source,is_banned,source_id,source_url) VALUES `
        const values = []
        let index = 1
        for (const school of schools) {
            query += `($${index}`
            index++
            values.push("default")

            query += `,$${index}`
            index++
            values.push(school.source)

            query += `,$${index}`
            index++
            values.push(school.is_banned)

            query += `,$${index}`
            index++
            values.push(school.source_id ?? "default")

            query += `,$${index}`
            index++
            values.push(school.source_url ?? "default)")
        }
        query += ";"
        await PgClient.getInstance().getClient().query<JobOfferHistory>(query, values)

        return schools.length
    },

    deleteOne: function (id: string): Promise<number> {
        throw new Error("Function not implemented.")
    },

    deleteMany: function (ids: string[]): Promise<number> {
        throw new Error("Function not implemented.")
    },
}
