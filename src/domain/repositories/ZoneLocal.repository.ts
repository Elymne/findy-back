import Zone from "../models/clean/Zone.model"

export default interface ZoneLocalRepository {
    findOne(id: string): Promise<Zone | undefined>
    findAll(): Promise<Zone[]>
    deleteAll(): Promise<void>
    createAll(zones: Zone[]): Promise<void>
    createOne(zone: Zone): Promise<void>
}
