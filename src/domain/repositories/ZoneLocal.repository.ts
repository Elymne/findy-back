import Zone from "../models/clean/Zone.model"

export default interface ZoneLocalRepository {
    findUnique(id: string): Promise<Zone | undefined>
    findMany(params: FindManyParams): Promise<Zone[]>
    findAll(): Promise<Zone[]>

    deleteAll(): Promise<void>

    createMany(zones: Zone[]): Promise<void>
    createOne(zone: Zone): Promise<void>
}

type FindManyParams = {
    name?: string
}
