import express, { Request, Response } from "express"
import { Failure } from "@App/core/interfaces/abstract.usecase"
import { cache24Successes } from "@App/core/tools/cache"
import { GetOneCityByCodeUsecase, GetOneCityByCodeUsecaseImpl } from "@App/domain/usecases/cities/getOneCityByCode.usecase"

const getOneCityUsecase: GetOneCityByCodeUsecase = GetOneCityByCodeUsecaseImpl

const getOneCityByCodeRoute = express.Router().get("/code/:code", cache24Successes, async (req: Request, res: Response) => {
    const result = await getOneCityUsecase.perform({ code: req.params.code })

    if (result instanceof Failure) {
        return res.status(result.errorCode).send(result)
    }

    res.status(200).send(result)
})

export default getOneCityByCodeRoute
