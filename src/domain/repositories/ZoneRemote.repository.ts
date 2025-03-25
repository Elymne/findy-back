import Zone from "../models/Zone.model";

export default interface ZoneRemoteRepository {
    findAll(text: string): Promise<Zone[]>;
    findOne(code: string): Promise<Zone | null>;
}
