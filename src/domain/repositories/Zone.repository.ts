import Zone from "../models/Zone.model";

export default interface ZoneRepository {
    findManyByName(name: string): Promise<Zone[]>;
    findOneByCode(code: string): Promise<Zone | null>;
}
