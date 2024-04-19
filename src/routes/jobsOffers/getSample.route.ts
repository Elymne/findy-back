import express, { Request, Response } from "express"
import { Failure } from "@App/core/interfaces/abstract.usecase"
import GetSampleUsecase, { GetSampleUsecaseImpl } from "@App/domain/usecases/jobsOffers/getSample.usecase"
import { cache24hours } from "@App/core/tools/cache"

const getSampleUsecase: GetSampleUsecase = GetSampleUsecaseImpl

const getSampleJobOffersRoute = express.Router().get("/sample", cache24hours, async (req: Request, res: Response) => {
    const result = await getSampleUsecase.perform()

    if (result instanceof Failure) {
        return res.status(result.errorCode).send(result)
    }

    res.status(200).send(result)
})

export default getSampleJobOffersRoute
