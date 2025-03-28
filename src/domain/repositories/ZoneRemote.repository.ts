import Zone from "../models/Zone.model"

export default interface ZoneRemoteRepository {
    findAll(): Promise<Zone[]>
}
