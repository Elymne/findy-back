import express, { Request, Response } from "express"
import { Failure } from "@App/core/interfaces/abstract.usecase"
import GetSampleUsecase, { GetSampleUsecaseImpl } from "@App/domain/usecases/jobsOffers/getSample.usecase"
import { cache24hours } from "@App/core/tools/cache"
import { query, validationResult } from "express-validator"

const getSampleUsecase: GetSampleUsecase = GetSampleUsecaseImpl

const getSampleJobOffersRoute = express
    .Router()
    .get("/sample", query("categ").isString().notEmpty().escape(), cache24hours, async (req: Request, res: Response) => {
        const validator = validationResult(req)
        if (!validator.isEmpty()) {
            res.status(404).send(validator)
            return
        }

        const result = await getSampleUsecase.perform({
            categ: req.query.keywords as string,
        })

        if (result instanceof Failure) {
            return res.status(result.errorCode).send(result)
        }

        res.status(200).send(result)
    })

export default getSampleJobOffersRoute
