import { Generated, Insertable, Selectable, Updateable } from "kysely"

export default interface SchoolTable {
    id: Generated<string>
    name: string
}

export type SchoolModel = Selectable<SchoolTable>
export type SchoolModelCreate = Insertable<SchoolTable>
export type SchoolModelUpdate = Updateable<SchoolTable>
