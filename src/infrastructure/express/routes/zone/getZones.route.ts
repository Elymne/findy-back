import express, { Request, Response } from "express"
import { query, validationResult } from "express-validator"
import { cache24hours } from "../../middlewares/cache"
import ZoneDatasource from "@App/infrastructure/datasources/geoapi/ZoneDatasource"
import GetZones from "@App/domain/usecases/fetching/GetZones.usecase"
import { Failure, Success } from "@App/core/Result"

const getZones: GetZones = new GetZones(new ZoneDatasource())

const getZonesRoute = express.Router().get("/", query("text").isString().notEmpty().escape(), cache24hours, async (req: Request, res: Response) => {
    const validator = validationResult(req)
    if (!validator.isEmpty()) {
        res.status(400).send(validator)
        return
    }

    const result = await getZones.perform({
        text: (req.query.text ?? "") as string,
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

export default getZonesRoute
