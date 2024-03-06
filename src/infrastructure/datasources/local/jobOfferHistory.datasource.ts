import { DBDataSource } from "@App/core/databases/database.datasource"
import { PgClient } from "@App/core/databases/pgClient"
import { JobOfferHistory, JobOfferSource } from "@App/domain/entities/jobOfferHistory.entity"

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

    addOne: async function (school: JobOfferHistory): Promise<JobOfferHistory> {
        const query = `INSERT INTO ${this.tableName} (id,source,is_banned,source_id,source_url) VALUES ($1,$2,$3,$4,$5);`
        await PgClient.getInstance()
            .getClient()
            .query<JobOfferHistory>(query, [school.id, school.source, school.is_banned, school.source_id, school.source_url])
        return school
    },

    addMany: async function (schools: JobOfferHistory[]): Promise<JobOfferHistory[]> {
        if (schools.length == 0) return []

        let query = `INSERT INTO ${this.tableName} (id,source,is_banned,source_id,source_url) VALUES `
        const values = []
        let index = 1
        for (const school of schools) {
            query += `($${index}`
            index++
            values.push(school.id)

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

        await PgClient.getInstance().getClient().query<JobOfferHistory>(query, values)
        return schools
    },

    deleteOne: async function (id: string): Promise<number> {
        const query = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *;`
        const res = await PgClient.getInstance().getClient().query<number>(query, [id])
        return [...res][0]
    },

    deleteMany: async function (ids: string[]): Promise<number> {
        if (ids.length == 0) return 0

        let query = `DELETE FROM ${this.tableName} WHERE `
        for (let index = 1; index < ids.length + 1; index++) {
            query += `id = $${index} AND`
        }

        query = query.substring(0, query.length - 3)
        query += " RETURNING *;"

        const result = await PgClient.getInstance().getClient().query<number>(query, ids)
        return [...result][0]
    },

    findAllBySource: async function (source: JobOfferSource): Promise<JobOfferHistory[]> {
        const query = `SELECT * FROM ${this.tableName} WHERE source = $1`
        const res = await PgClient.getInstance().getClient().query<JobOfferHistory>(query, [source])
        return [...res]
    },
}
