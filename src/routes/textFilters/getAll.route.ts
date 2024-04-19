import express, { Request, Response } from "express"
import { Failure } from "@App/core/interfaces/abstract.usecase"
import { cache5Mins } from "@App/core/tools/cache"
import GetAllTextFiltersUsecase, { GetAllTextFiltersUsecaseImpl } from "@App/domain/usecases/textFilters/getAllTextFilters.usecase"
import { basicAuth } from "@App/core/tools/auth"

const getAllTextFiltersUsecase: GetAllTextFiltersUsecase = GetAllTextFiltersUsecaseImpl

const getAllTextFiltersRoute = express.Router().get("/", basicAuth, cache5Mins, async (req: Request, res: Response) => {
    const result = await getAllTextFiltersUsecase.perform()

    if (result instanceof Failure) {
        return res.status(result.errorCode).send(result)
    }

    res.status(200).send(result)
})

export default getAllTextFiltersRoute
