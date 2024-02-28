import { DatabaseDatasource } from "~/core/databases/database.datasource"
import { PgClient } from "~/core/databases/pgClient"
import { TextFilter } from "~/domain/entities/databases/textFilter.entity"

export interface SchoolDatasource extends DatabaseDatasource<TextFilter> {}

export const SchoolDatasourceImpl: SchoolDatasource = {
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

    deleteOne: async function (id: string): Promise<number> {
        const query = `DELETE FROM ${this.tableName} WHERE id = $1`
        const res = await await PgClient.getInstance().getClient().query(query, [id])
        return 0
    },

    deleteMany: function (ids: string[]): Promise<number> {
        throw new Error("Function not implemented.")
    },

    addOne: function (school: TextFilter): Promise<number> {
        throw new Error("Function not implemented.")
    },

    addMany: function (schools: TextFilter[]): Promise<number> {
        throw new Error("Function not implemented.")
    },
}
