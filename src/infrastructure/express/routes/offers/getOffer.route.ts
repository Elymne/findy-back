import express, { Request, Response } from "express"
import { cache24hours } from "@App/infrastructure/express/middlewares/cache"
import OfferRemoteDatasource from "@App/infrastructure/datasources/remote/france_travail/OfferDatasource"
import GetOneOffer from "@App/domain/usecases/fetching/GetOneOffer.usecase"
import { Failure, Success } from "@App/core/Result"

const getOneOffer = new GetOneOffer(new OfferRemoteDatasource())

const getOneOfferRoute = express.Router().get("/:id", cache24hours, async (req: Request, res: Response) => {
    const id = req.params.id ? (req.params.id as string) : null
    if (!id) {
        res.status(400).send({
            message: `Bad request`,
            details: `The route that you are using need an id. Actually it's ${req.params.id} that is given.`,
        })
        return
    }

    const result = await getOneOffer.perform({ id: id })

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

export default getOneOfferRoute
