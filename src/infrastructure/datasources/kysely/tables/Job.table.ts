import { Insertable, Selectable, Updateable } from "kysely"

export default interface JobTable {
    id: string
    title: string
}

export type JobLocalModel = Selectable<JobTable>
export type JobLocalCreate = Insertable<JobTable>
export type JobLocalUpdate = Updateable<JobTable>
