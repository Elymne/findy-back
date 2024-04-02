import { PgClient } from "@App/core/clients/pg.client"
import { DatabaseDatasource } from "@App/core/interfaces/Database.datasource"
import TextFilter from "@App/domain/entities/textFilter.entity"

export default interface TextFilterDatasource extends DatabaseDatasource<TextFilter> {
    findAll(): any
}

export const TextFilterDatasourceImpl: TextFilterDatasource = {
    tableName: "text_filter",

    findOne: async function (id: string): Promise<TextFilter[]> {
        const query = `SELECT * FROM ${this.tableName} WHERE id = $1`
        const res = await PgClient.getInstance().getClient().query<TextFilter>(query, [id])
        return [...res]
    },

    findAll: async function (): Promise<TextFilter[]> {
        const query = `SELECT * FROM ${this.tableName}`
        const res = await PgClient.getInstance().getClient().query<TextFilter>(query, [])
        return [...res]
    },

    addOne: async function (textFilter: TextFilter): Promise<TextFilter> {
        const query = `INSERT INTO ${this.tableName} (id,value) VALUES ($1,$2);`
        await PgClient.getInstance().getClient().query<TextFilter>(query, [textFilter.id, textFilter.value])
        return textFilter
    },

    addMany: async function (textFilters: TextFilter[]): Promise<TextFilter[]> {
        if (textFilters.length == 0) return []

        let query = `INSERT INTO ${this.tableName} (id,source,is_banned,source_id,source_url) VALUES `
        const values = []
        let index = 1
        for (const textFilter of textFilters) {
            query += `($${index}`
            index++
            values.push(textFilter.id)

            query += `,$${index}`
            index++
            values.push(textFilter.value)
        }

        query = query.substring(0, query.length - 1)
        query += ";"

        await PgClient.getInstance().getClient().query<number>(query, values)
        return textFilters
    },

    deleteOne: async function (id: string): Promise<number> {
        const query = `DELETE FROM ${this.tableName} WHERE id = $1`
        const res = await await PgClient.getInstance().getClient().query<number>(query, [id])
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
