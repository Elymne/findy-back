import Zone from "@App/domain/models/Zone.model"
import ZoneLocalRepository from "@App/domain/repositories/ZoneLocal.repository"
import { RowDataPacket } from "mysql2"
import { MysqlDatabase } from "./db/MysqlDatabase"

export default class ZoneLocalDatasource implements ZoneLocalRepository {
    async findOne(id: string): Promise<Zone | undefined> {
        const [result] = await MysqlDatabase.getInstance().getConnec().query<ZoneResult[]>("SELECT * FROM zone WHERE id = ?", [id])
        if (result.length == 0) {
            return undefined
        }
        return parse(result[0])
    }

    async findAll(): Promise<Zone[]> {
        const [result] = await MysqlDatabase.getInstance().getConnec().query<ZoneResult[]>("SELECT * FROM zone")
        return result.map((elem) => parse(elem))
    }

    async deleteAll(): Promise<void> {
        MysqlDatabase.getInstance().getConnec().query("DELETE FROM zone")
    }

    async storeAll(zones: Zone[]): Promise<void> {
        const query = "INSERT INTO zone(id, name, lat, lng) VALUES ?"
        const values = zones.map((elem) => {
            return [elem.id, elem.name, elem.lat, elem.lng]
        })

        MysqlDatabase.getInstance().getConnec().query(query, [values])
    }

    async storeUnique(zone: Zone): Promise<void> {
        const query = "INSERT INTO zone(id, name, lat, lng) VALUES (?)"
        const values = [zone.id, zone.name, zone.lat, zone.lng]
        MysqlDatabase.getInstance().getConnec().query(query, values)
    }
}

interface ZoneResult extends RowDataPacket {
    id: string
    name: string
    lat: number
    lng: number
}

function parse(zoneLocalModel: ZoneResult): Zone {
    return {
        id: zoneLocalModel.id,
        name: zoneLocalModel.name,
        lat: zoneLocalModel.lat,
        lng: zoneLocalModel.lng,
    }
}
