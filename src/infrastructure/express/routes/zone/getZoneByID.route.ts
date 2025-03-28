import express, { Request, Response } from "express"
import { cache24hours } from "../../middlewares/cache"
import GetZoneByID from "@App/domain/usecases/fetching/GetZoneByID.usecase"
import { Failure, Success } from "@App/core/Result"
import ZoneLocalDatasource from "@App/infrastructure/datasources/mysql/ZoneLocalDatasource"

const getZoneByID: GetZoneByID = new GetZoneByID(new ZoneLocalDatasource())

const getZoneByIDRoute = express.Router().get("/:id", cache24hours, async (req: Request<{ id: string }>, res: Response) => {
    const result = await getZoneByID.perform({
        id: req.params.id,
    })

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

export default getZoneByIDRoute
