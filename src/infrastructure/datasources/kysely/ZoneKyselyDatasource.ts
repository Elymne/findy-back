import Zone from "@App/domain/models/clean/Zone.model"
import ZoneLocalRepository from "@App/domain/repositories/ZoneLocal.repository"
import KyselyDatabase from "./db/KyselyDatabase"
import { ZoneCreate } from "./tables/zone_table"
import { injectable } from "tsyringe"

@injectable()
export default class ZoneLocalDatasource implements ZoneLocalRepository {
    private kyselyDatabase: KyselyDatabase

    constructor(kyselyDatabase: KyselyDatabase) {
        this.kyselyDatabase = kyselyDatabase
    }

    async findUnique(id: string): Promise<Zone | undefined> {
        const result = await this.kyselyDatabase.connec.selectFrom("zone").selectAll().where("id", "=", id).executeTakeFirst()
        if (!result) return undefined

        return {
            id: result.id,
            name: result.name,
            lat: result.lat,
            lng: result.lng,
        }
    }

    async findMany(params: { name?: string }): Promise<Zone[]> {
        let query = this.kyselyDatabase.connec.selectFrom("zone").selectAll()
        if (params.name) {
            query = query.where("name", "like", params.name)
        }
        const result = await query.execute()
        return result
    }

    async findAll(): Promise<Zone[]> {
        const results = await this.kyselyDatabase.connec.selectFrom("zone").selectAll().execute()
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
        await this.kyselyDatabase.connec.deleteFrom("zone").execute()
    }

    async createMany(zones: Zone[]): Promise<void> {
        if (zones.length == 0) {
            return
        }

        const zonesTable: ZoneCreate[] = zones.map((zone) => {
            return {
                id: zone.id,
                name: zone.name,
                lat: zone.lat,
                lng: zone.lng,
            }
        })

        await this.kyselyDatabase.connec.insertInto("zone").values(zonesTable).execute()
    }

    async createOne(zone: Zone): Promise<void> {
        const jobTable: ZoneCreate = {
            id: zone.id,
            name: zone.name,
            lat: zone.lat,
            lng: zone.lng,
        }

        await this.kyselyDatabase.connec.insertInto("zone").values(jobTable).execute()
    }
}
