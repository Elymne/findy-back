import Zone from "@App/domain/models/clean/Zone.model"
import ZoneLocalRepository from "@App/domain/repositories/ZoneLocal.repository"
import KyselyDatabase from "./db/KyselyDatabase"
import { ZoneCreate } from "./tables/zone_table"

export default class ZoneLocalDatasource implements ZoneLocalRepository {
    async findOne(id: string): Promise<Zone | undefined> {
        const result = await KyselyDatabase.get.connec.selectFrom("zone").selectAll().where("id", "=", id).executeTakeFirst()
        if (!result) return undefined

        return {
            id: result.id,
            name: result.name,
            lat: result.lat,
            lng: result.lng,
        }
    }

    async findAll(): Promise<Zone[]> {
        const results = await KyselyDatabase.get.connec.selectFrom("zone").selectAll().execute()
        return results.map((result) => {
            return {
                id: result.id,
                name: result.name,
                lat: result.lat,
                lng: result.lng,
            }
        })
    }

    async deleteAll(): Promise<void> {
        await KyselyDatabase.get.connec.deleteFrom("zone").execute()
    }

    async createAll(zones: Zone[]): Promise<void> {
        const zonesTable: ZoneCreate[] = zones.map((zone) => {
            return {
                id: zone.id,
                name: zone.name,
                lat: zone.lat,
                lng: zone.lng,
            }
        })

        await KyselyDatabase.get.connec.insertInto("zone").values(zonesTable).execute()
    }

    async createOne(zone: Zone): Promise<void> {
        const jobTable: ZoneCreate = {
            id: zone.id,
            name: zone.name,
            lat: zone.lat,
            lng: zone.lng,
        }

        await KyselyDatabase.get.connec.insertInto("zone").values(jobTable).execute()
    }
}
