import { PgClient } from "@App/core/clients/pg.client"
import { DatabaseDatasource } from "@App/core/interfaces/Database.datasource"
import JobOffer from "@App/domain/entities/jobOffer.entity"

export interface JobOfferDatasource extends DatabaseDatasource<JobOffer> {}

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
                jobOffer.imageUrl,
                jobOffer.companyName,
                jobOffer.companyLogoUrl,
                jobOffer.cityName,
                jobOffer.sourceUrl,
                jobOffer.sourceData,
                jobOffer.createdAt,
                jobOffer.updatedAt,
                jobOffer.createdWhile,
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
            values.push(jobOffer.imageUrl)

            query += `,$${index}`
            index++
            values.push(jobOffer.companyName)

            query += `,$${index}`
            index++
            values.push(jobOffer.companyLogoUrl)

            query += `,$${index}`
            index++
            values.push(jobOffer.cityName)

            query += `,$${index}`
            index++
            values.push(jobOffer.sourceUrl)

            query += `,$${index}`
            index++
            values.push(jobOffer.sourceData)

            query += `,$${index}`
            index++
            values.push(jobOffer.createdAt ?? null)

            query += `,$${index}`
            index++
            values.push(jobOffer.updatedAt ?? null)

            query += `,$${index}),`
            index++
            values.push(jobOffer.createdWhile ?? null)
        }

        query = query.substring(0, query.length - 1)
        query += ";"

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
