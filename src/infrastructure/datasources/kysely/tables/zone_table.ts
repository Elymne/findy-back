import { ColumnType, Insertable, Selectable, Updateable } from "kysely"

export default interface ZoneTable {
    id: ColumnType<string, string, never>
    name: ColumnType<string, string, never>
    lat: ColumnType<number, number, never>
    lng: ColumnType<number, number, never>
}

export type PersonResult = Selectable<ZoneTable>
export type ZoneCreate = Insertable<ZoneTable>
export type ZoneUpdate = Updateable<ZoneTable>
