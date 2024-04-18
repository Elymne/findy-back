import PgClient from "@App/core/clients/pg.client"
import JobOffer from "@App/domain/entities/jobOffer.entity"
import { Client } from "ts-postgres"

export default interface JobOfferDatasource {
    tableName: "job_offer"
    client: Client
    findOne: (id: string) => Promise<JobOffer>
    findAll: () => Promise<JobOffer[]>
    addOne: (value: JobOffer) => Promise<void>
    addMany: (values: JobOffer[]) => Promise<void>
    deleteOne: (id: string) => Promise<number>
    deleteMany: (ids: string[]) => Promise<number>
}

export const JobOfferDatasourceImpl: JobOfferDatasource = {
    client: PgClient.getInstance().getClient(),
    tableName: "job_offer",

    findOne: async function (id: string): Promise<JobOffer> {
        const query = `SELECT * FROM ${this.tableName} WHERE id = $1`
        const res = await this.client.query<JobOffer>(query, [id])
        return [...res][0]
    },

    findAll: async function (): Promise<JobOffer[]> {
        const query = `SELECT * FROM ${this.tableName}`
        const res = await this.client.query<JobOffer>(query, [])
        return [...res]
    },

    addOne: async function (jobOffer: JobOffer): Promise<void> {
        const query = `INSERT INTO ${this.tableName} 
        (id,title,image_url,company_name,company_logo_url,city_name,source_url,source_data,created_at,updated_at,created_while) 
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);`
        this.client.query<JobOffer>(query, [
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
    },

    addMany: async function (jobOffers: JobOffer[]): Promise<void> {
        if (jobOffers.length == 0) {
            return
        }

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

        this.client.query<JobOffer>(query, values)
    },

    deleteOne: async function (id: string): Promise<number> {
        const query = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *;`
        const res = await this.client.query<number>(query, [id])
        return [...res][0]
    },

    deleteMany: async function (ids: string[]): Promise<number> {
        if (ids.length == 0) {
            return 0
        }

        let query = `DELETE FROM ${this.tableName} WHERE `
        for (let index = 1; index < ids.length + 1; index++) {
            query += `id = $${index} AND`
        }
        query = query.substring(0, query.length - 3)
        query += " RETURNING *;"

        const result = await this.client.query<number>(query, ids)
        return [...result][0]
    },
}
