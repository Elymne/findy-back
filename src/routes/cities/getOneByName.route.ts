import express, { Request, Response } from "express"
import { Failure } from "@App/core/interfaces/abstract.usecase"
import { cache24hours } from "@App/core/tools/cache"
import GetOneCityByNameUsecase, { GetOneCityByNameUsecaseImpl } from "@App/domain/usecases/cities/getOneCityByName.usecase"

const getOneCityUsecase: GetOneCityByNameUsecase = GetOneCityByNameUsecaseImpl

const getOneCityByNameRoute = express.Router().get("/name/:name", cache24hours, async (req: Request, res: Response) => {
    const result = await getOneCityUsecase.perform({ name: req.params.name })

    if (result instanceof Failure) {
        return res.status(result.errorCode).send(result)
    }

    res.status(200).send(result)
})

export default getOneCityByNameRoute
