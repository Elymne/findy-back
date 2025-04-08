import express, { Request, Response } from "express"
import { cache24hours } from "@App/infrastructure/express/middlewares/cache"
import OfferFTDatasource from "@App/infrastructure/datasources/francetravail/OfferFTDatasource"
import GetSample from "@App/domain/usecases/fetching/GetSample"
import { Failure, Success } from "@App/core/Result"

const getOfferSample: GetSample = new GetSample(new OfferFTDatasource())

const getSampleRoute = express.Router().get("/", cache24hours, async (req: Request, res: Response) => {
    const result = await getOfferSample.perform()
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

export default getSampleRoute
