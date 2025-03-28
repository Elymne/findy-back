import Zone from "../models/Zone.model"

export default interface ZoneLocalRepository {
    findOne(id: string): Promise<Zone | undefined>
    findAll(): Promise<Zone[]>
    deleteAll(): Promise<void>
    storeAll(zones: Zone[]): Promise<void>
    storeUnique(zone: Zone): Promise<void>
}
