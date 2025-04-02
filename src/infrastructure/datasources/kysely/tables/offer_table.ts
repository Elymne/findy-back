import { ColumnType, Insertable, Selectable, Updateable } from "kysely"

export default interface OfferTable {
    id: ColumnType<string, string, never>
    title: string
    img_url: string | undefined

    company_id: string
    zone_id: string
    job_id: string

    tags: string[]

    created_at: ColumnType<Date, Date, never>
    updated_at: Date | undefined

    origin: number
    origin_url: string | undefined
}

export type OfferResult = Selectable<OfferTable>
export type OfferCreate = Insertable<OfferTable>
export type OfferUpdate = Updateable<OfferTable>
