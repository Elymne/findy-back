import { Insertable, Selectable, Updateable } from "kysely"

export default interface LastScrapDateTable {
    value: number
}

export type LastScrapDateModel = Selectable<LastScrapDateTable>
export type LastScrapDateCreate = Insertable<LastScrapDateTable>
export type LastScrapDateUpdate = Updateable<LastScrapDateTable>
