import express, { Request, Response } from "express"
import { cache24hours } from "../../middlewares/cache"
import GetZones from "@App/domain/usecases/fetching/GetZones.usecase"
import { Failure, Success } from "@App/core/Result"
import ZoneLocalDatasource from "@App/infrastructure/datasources/kysely/ZoneKyselyDatasource"

const zoneLocalRepository = new ZoneLocalDatasource()
const getZones: GetZones = new GetZones(zoneLocalRepository)

const getZonesRoute = express.Router().get("/", cache24hours, async (req: Request, res: Response) => {
    const result = await getZones.perform()

    if (result instanceof Failure) {
        res.status(result.code).send(result.error)
        return
    }

    if (result instanceof Success) {
        res.status(result.code).send(result.data)
        return
    }

    res.status(result.code).send({ message: "Unknown type of result." })
})

export default getZonesRoute
