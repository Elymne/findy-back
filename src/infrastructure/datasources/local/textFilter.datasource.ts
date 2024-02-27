import { UUID } from "crypto"
import { PgClient } from "~/core/databases/pgClient"
import { createTextFilterTableQuery } from "./queries/school.queries"
import { TextFilter } from "~/domain/entities/databases/textFilter.entity"

export interface SchoolDatasource {
    tableName: string
    createTable: () => Promise<void>
    findOne: (id: UUID) => Promise<TextFilter[]>
    findByName: (name: string) => Promise<TextFilter[]>
    findAll: () => Promise<TextFilter[]>
    deleteOne: (id: UUID) => Promise<number>
    deleteMany: (ids: UUID[]) => Promise<number>
    addOne: (school: TextFilter) => Promise<TextFilter[]>
    addMany: (schools: TextFilter[]) => Promise<TextFilter[]>
}

export const SchoolDatasourceImpl: SchoolDatasource = {
    tableName: "text_filter",

    createTable: async function (): Promise<void> {
        await PgClient.getInstance().getClient().query(createTextFilterTableQuery, [])
    },

    findOne: async function (id: UUID): Promise<TextFilter[]> {
        const query = `SELECT * FROM ${this.tableName} WHERE id = $1`
        const res = await PgClient.getInstance().getClient().query<TextFilter>(query, [id])
        return [...res]
    },

    findByName: async function (name: string): Promise<TextFilter[]> {
        const query = `SELECT * FROM ${this.tableName} WHERE value = $1`
        const res = await PgClient.getInstance().getClient().query<TextFilter>(query, [name])
        return [...res]
    },

    findAll: async function (): Promise<TextFilter[]> {
        const query = `SELECT * FROM ${this.tableName}`
        const res = await PgClient.getInstance().getClient().query<TextFilter>(query, [])
        return [...res]
    },

    deleteOne: async function (id: UUID): Promise<number> {
        const query = `DELETE FROM ${this.tableName} WHERE id = $1`
        const res = await await PgClient.getInstance().getClient().query(query, [id])
        return 0
    },

    deleteMany: function (ids: UUID[]): Promise<number> {
        throw new Error("Function not implemented.")
    },

    addOne: function (school: TextFilter): Promise<TextFilter[]> {
        throw new Error("Function not implemented.")
    },

    addMany: function (schools: TextFilter[]): Promise<TextFilter[]> {
        throw new Error("Function not implemented.")
    },
}
