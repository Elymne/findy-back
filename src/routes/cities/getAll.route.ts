import express, { Request, Response } from "express"
import { GetCitiesUsecase, GetCitiesUsecaseImpl } from "@App/domain/usecases/cities/getCities.usecase"
import { Failure } from "@App/core/interfaces/abstract.usecase"
import { cache24Successes } from "@App/core/tools/cache"

const getCitiesUsecase: GetCitiesUsecase = GetCitiesUsecaseImpl

const getAllCitiesRoute = express.Router().get("/", cache24Successes, async (req: Request, res: Response) => {
    const result = await getCitiesUsecase.perform()

    if (result instanceof Failure) {
        return res.status(result.errorCode).send(result)
    }

    res.status(200).send(result)
})

export default getAllCitiesRoute
