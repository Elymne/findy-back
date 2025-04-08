import express, { Request, Response } from "express"
import { Failure, Success } from "@App/core/Result"
import UpdateZones from "@App/domain/usecases/storing/UpdateZones.usecase"
import { container } from "tsyringe"

export const updateZoneRoute = express.Router().get("/zones", async (req: Request, res: Response) => {
    const result = await container.resolve(UpdateZones).perform()
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
