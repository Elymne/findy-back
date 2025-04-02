import Zone from "../models/clean/Zone.model"

export default interface ZoneRemoteRepository {
    findAll(): Promise<Zone[]>
}
