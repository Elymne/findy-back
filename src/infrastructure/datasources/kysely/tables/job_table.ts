import { ColumnType, Insertable, Selectable, Updateable } from "kysely"

export default interface JobTable {
    id: ColumnType<string, string, never>
    title: string
}

export type JobResult = Selectable<JobTable>
export type JobCreate = Insertable<JobTable>
export type JobUpdate = Updateable<JobTable>
