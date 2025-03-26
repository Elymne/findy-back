import express, { Request, Response } from "express"
import { cache24hours } from "../../middlewares/cache"
import ZoneDatasource from "@App/infrastructure/datasources/remote/geoapi/ZoneDatasource"
import GetZoneByCode from "@App/domain/usecases/fetching/GetZoneByCode.usecase"
import { Failure, Success } from "@App/core/Result"

const getZoneByCode: GetZoneByCode = new GetZoneByCode(new ZoneDatasource())

const getZonebyCodeRoute = express.Router().get("/:code", cache24hours, async (req: Request<{ code: string }>, res: Response) => {
    const result = await getZoneByCode.perform({
        code: (req.params.code ?? "") as string,
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

export default getZonebyCodeRoute
