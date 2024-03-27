import express, { Request, Response } from "express"
import { Failure } from "@App/core/interfaces/abstract.usecase"
import { GetOneCityUsecase, GetOneCityUsecaseImpl } from "@App/domain/usecases/cities/getOneCity.usecase"
import { cache24Successes } from "@App/core/tools/cache"

const getOneCityUsecase: GetOneCityUsecase = GetOneCityUsecaseImpl

const getOneCityByNameRoute = express.Router().get("/name/:name", cache24Successes, async (req: Request, res: Response) => {
    const result = await getOneCityUsecase.perform({ name: req.params.name })

    if (result instanceof Failure) {
        return res.status(result.errorCode).send(result)
    }

    res.status(200).send(result)
})

export default getOneCityByNameRoute
