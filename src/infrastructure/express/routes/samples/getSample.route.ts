import express, { Request, Response } from "express"
import { cache24hours } from "@App/infrastructure/express/middlewares/cache"
import GetSample from "@App/domain/usecases/fetching/GetSample"
import { Failure, Success } from "@App/core/Result"
import { container } from "tsyringe"

const getSampleRoute = express.Router().get("/", cache24hours, async (req: Request, res: Response) => {
    const result = await container.resolve(GetSample).perform()

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
