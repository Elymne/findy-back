import express, { Request, Response } from "express"
import { cache24hours } from "@App/infrastructure/express/middlewares/cache"
import { Failure, Success } from "@App/core/Result"
import GetJobByID from "@App/domain/usecases/fetching/GetJobByID.usecase"
import { container } from "tsyringe"

const getJobByIDRoute = express.Router().get("/:id", cache24hours, async (req: Request<{ id: string }>, res: Response) => {
    const result = await container.resolve(GetJobByID).perform({
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

export default getJobByIDRoute
