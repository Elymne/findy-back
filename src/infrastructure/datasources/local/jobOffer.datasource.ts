import { DBDataSource } from "@App/core/databases/database.datasource"
import { PgClient } from "@App/core/databases/pgClient"
import { JobOffer } from "@App/domain/entities/jobOffer.entity"

export interface JobOfferDatasource extends DBDataSource<JobOffer> {}

export const JobOfferDatasourceImpl: JobOfferDatasource = {
    tableName: "job_offer",
    findOne: async function (id: string): Promise<JobOffer[]> {
        const query = `SELECT * FROM ${this.tableName} WHERE id = $1`
        const res = await PgClient.getInstance().getClient().query<JobOffer>(query, [id])
        return [...res]
    },
    findAll: async function (): Promise<JobOffer[]> {
        const query = `SELECT * FROM ${this.tableName}`
        const res = await PgClient.getInstance().getClient().query<JobOffer>(query, [])
        return [...res]
    },
    addOne: async function (jobOffer: JobOffer): Promise<JobOffer> {
        const query = `INSERT INTO ${this.tableName} 
        (id,title,image_url,company_name,company_logo_url,city_name,source_url,source_data,created_at,updated_at,created_while) 
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);`
        await PgClient.getInstance()
            .getClient()
            .query<JobOffer>(query, [
                jobOffer.id,
                jobOffer.title,
                jobOffer.image_url,
                jobOffer.company_name,
                jobOffer.company_logo_url,
                jobOffer.city_name,
                jobOffer.source_url,
                jobOffer.source_data,
                jobOffer.created_at,
                jobOffer.updated_at,
                jobOffer.created_while,
            ])
        return jobOffer
    },
    addMany: async function (jobOffers: JobOffer[]): Promise<JobOffer[]> {
        if (jobOffers.length == 0) return []

        let query = `INSERT INTO ${this.tableName} 
        (id,title,image_url,company_name,company_logo_url,city_name,source_url,source_data,created_at,updated_at,created_while) 
        VALUES `
        const values = []
        let index = 1
        for (const jobOffer of jobOffers) {
            query += `($${index}`
            index++
            values.push(jobOffer.id)

            query += `,$${index}`
            index++
            values.push(jobOffer.title)

            query += `,$${index}`
            index++
            values.push(jobOffer.image_url)

            query += `,$${index}`
            index++
            values.push(jobOffer.company_name)

            query += `,$${index}`
            index++
            values.push(jobOffer.company_logo_url)

            query += `,$${index}`
            index++
            values.push(jobOffer.city_name)

            query += `,$${index}`
            index++
            values.push(jobOffer.source_url)

            query += `,$${index}`
            index++
            values.push(jobOffer.source_data)

            query += `,$${index}`
            index++
            values.push(jobOffer.created_at ?? null)

            query += `,$${index}`
            index++
            values.push(jobOffer.updated_at ?? null)

            query += `,$${index}),`
            index++
            values.push(jobOffer.created_while ?? null)
        }

        query = query.substring(0, query.length - 1)
        query += ";"

        console.log(query)

        await PgClient.getInstance().getClient().query<JobOffer>(query, values)
        return jobOffers
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
}
