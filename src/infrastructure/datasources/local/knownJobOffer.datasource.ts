import { DBDataSource } from "@App/infrastructure/datasources/local/abstractDatabase.datasource"
import { PgClient } from "@App/infrastructure/tools/clients/pg.client"
import { SourceSite } from "@App/domain/entities/enums/sourceData.enum"
import { KnownJobOffer } from "@App/domain/entities/knownJobOffer.entity"

export interface KnownJobOfferDatasource extends DBDataSource<KnownJobOffer> {
    findAllBySource: (source: SourceSite) => Promise<KnownJobOffer[]>
}

export const KnownJobOfferDatasourceImpl: KnownJobOfferDatasource = {
    tableName: "known_job_offer",

    findOne: async function (id: string): Promise<KnownJobOffer[]> {
        const query = `SELECT * FROM ${this.tableName} WHERE id = $1`
        const res = await PgClient.getInstance().getClient().query<KnownJobOffer>(query, [id])
        return [...res]
    },

    findAll: async function (): Promise<KnownJobOffer[]> {
        const query = `SELECT * FROM ${this.tableName}`
        const res = await PgClient.getInstance().getClient().query<KnownJobOffer>(query, [])
        return [...res]
    },

    addOne: async function (school: KnownJobOffer): Promise<KnownJobOffer> {
        const query = `INSERT INTO ${this.tableName} (id,source,is_banned,source_id,source_url) VALUES ($1,$2,$3,$4,$5);`
        await PgClient.getInstance()
            .getClient()
            .query<KnownJobOffer>(query, [school.id, school.source, school.is_banned, school.source_id ?? null, school.source_url ?? null])
        return school
    },

    addMany: async function (schools: KnownJobOffer[]): Promise<KnownJobOffer[]> {
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
            values.push(school.source_id ?? null)

            query += `,$${index}),`
            index++
            values.push(school.source_url ?? null)
        }

        query = query.substring(0, query.length - 1)
        query += ";"

        await PgClient.getInstance().getClient().query<KnownJobOffer>(query, values)
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

    findAllBySource: async function (source: SourceSite): Promise<KnownJobOffer[]> {
        const query = `SELECT * FROM ${this.tableName} WHERE source = $1`
        const res = await PgClient.getInstance().getClient().query<KnownJobOffer>(query, [source])
        return [...res]
    },
}
