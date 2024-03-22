import express, { Request, Response } from "express"
import { cacheSuccesses } from "@App/core/cache"
import { GetCitiesUsecase, GetCitiesUsecaseImpl } from "@App/domain/usecases/getCities.usecase"
import { Failure } from "@App/domain/usecases/abstract.usecase"
import { GetOneCityUsecase, GetOneCityUsecaseImpl } from "@App/domain/usecases/getOneCity.usecase"

const router = express.Router()
const getCitiesUsecase: GetCitiesUsecase = GetCitiesUsecaseImpl
const getOneCityUsecase: GetOneCityUsecase = GetOneCityUsecaseImpl

router.get("/", cacheSuccesses, async (req: Request, res: Response) => {
    const result = await getCitiesUsecase.perform()

    if (result instanceof Failure) {
        return res.status(result.errorCode).send(result)
    }

    res.status(200).send(result)
})

router.get("/:code", cacheSuccesses, async (req: Request, res: Response) => {
    const result = await getOneCityUsecase.perform({ code: req.params.code })

    if (result instanceof Failure) {
        return res.status(result.errorCode).send(result)
    }

    res.status(200).send(result)
})

export default router
