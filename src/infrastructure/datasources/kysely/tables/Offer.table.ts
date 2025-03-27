import { ColumnType, Insertable, JSONColumnType, Selectable, Updateable } from "kysely"
// import { v4 as uuidv4 } from "uuid"

export default interface OfferTable {
    id: string
    title: string
    company: string

    codezone: string
    codejob: string | undefined

    tags: JSONColumnType<{
        values: string[]
    }>

    companyLogoUrl: string | undefined
    imgUrl: string | undefined

    createdAt: ColumnType<Date, string | undefined, never>
    updateAt: ColumnType<Date, string | undefined, never>

    origin: number
}

export type OfferModel = Selectable<OfferTable>
export type OfferModelCreate = Insertable<OfferTable>
export type OfferModelUpdate = Updateable<OfferTable>
