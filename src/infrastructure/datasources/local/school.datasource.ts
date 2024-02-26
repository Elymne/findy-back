import { UUID } from "crypto"
import { PgClient } from "~/core/databases/pgClient"
import { createSchoolTableQuery } from "./queries/school.queries"
import { School } from "~/domain/entities/school.entity"

export interface SchoolDatasource {
    createTable: () => Promise<void>
    findOne: (id: UUID) => Promise<School[]>
    findByName: (name: string) => Promise<School[]>
    findAll: () => Promise<School[]>
    deleteOne: (id: UUID) => Promise<number>
    deleteMany: (ids: UUID[]) => Promise<number>
    addOne: (school: School) => Promise<School[]>
    addMany: (schools: School[]) => Promise<School[]>
}

export const SchoolDatasourceImpl: SchoolDatasource = {
    createTable: async function (): Promise<void> {
        await PgClient.getInstance().getClient().query(createSchoolTableQuery, [])
    },

    findOne: async function (id: UUID): Promise<School[]> {
        const query = `SELECT * FROM school WHERE id = $1`
        const res = await PgClient.getInstance().getClient().query<School>(query, [id])
        return [...res]
    },

    findByName: async function (name: string): Promise<School[]> {
        const query = `SELECT * FROM school WHERE name = $1`
        const res = await PgClient.getInstance().getClient().query<School>(query, [name])
        return [...res]
    },

    findAll: async function (): Promise<School[]> {
        const query = `SELECT * FROM school`
        const res = await PgClient.getInstance().getClient().query<School>(query, [])
        return [...res]
    },

    deleteOne: async function (id: UUID): Promise<number> {
        const query = `DELETE FROM school WHERE id = $1`
        const res = await await PgClient.getInstance().getClient().query(query, [id])
        return 0
    },

    deleteMany: function (ids: UUID[]): Promise<number> {
        throw new Error("Function not implemented.")
    },

    addOne: function (school: School): Promise<School[]> {
        throw new Error("Function not implemented.")
    },

    addMany: function (schools: School[]): Promise<School[]> {
        throw new Error("Function not implemented.")
    },
}
