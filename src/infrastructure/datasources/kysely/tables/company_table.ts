import { ColumnType, Insertable, Selectable, Updateable } from "kysely"

export default interface CompanyTable {
    id: ColumnType<string, string, never>
    name: string
    description: string
    url: string
    logo_url: string
}

export type CompanyResult = Selectable<CompanyTable>
export type CompanyCreate = Insertable<CompanyTable>
export type CompanyUpdate = Updateable<CompanyTable>
