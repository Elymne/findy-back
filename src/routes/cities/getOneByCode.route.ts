import express, { Request, Response } from "express"
import { Failure } from "@App/core/interfaces/abstract.usecase"
import { GetOneCityUsecase, GetOneCityUsecaseImpl } from "@App/domain/usecases/cities/getOneCity.usecase"
import { cacheSuccesses } from "@App/core/tools/cache"

const getOneCityUsecase: GetOneCityUsecase = GetOneCityUsecaseImpl

const getOneCityByCodeRoute = express.Router().get("/:code", cacheSuccesses, async (req: Request, res: Response) => {
    const result = await getOneCityUsecase.perform({ code: req.params.code })

    if (result instanceof Failure) {
        return res.status(result.errorCode).send(result)
    }

    res.status(200).send(result)
})

export default getOneCityByCodeRoute
