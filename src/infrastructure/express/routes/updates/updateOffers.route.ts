import express, { Request, Response } from "express"
import { Failure, Success } from "@App/core/Result"
import { container } from "tsyringe"
import UpdateOffers from "@App/domain/usecases/storing/UpdateOffers.usecase"

export const updateOffersRoute = express.Router().get("/offers", async (req: Request, res: Response) => {
    const result = await container.resolve(UpdateOffers).perform()
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
