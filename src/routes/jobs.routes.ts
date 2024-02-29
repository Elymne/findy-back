import express, { Request, Response } from "express"
import { query, validationResult } from "express-validator"
import { cacheSuccesses } from "~/core/tools/cache"
import { GetJobOfferFTUsecase, GetJobOfferFTUsecaseImpl } from "~/domain/usecases/jobOffer/getJobOffersFT.usecase"
import { GetJobOffersWTTJUsecase, GetJobOffersWTTJUsecaseimpl } from "~/domain/usecases/jobOffer/getJobOffersWTTJ.usecase"

const router = express.Router()
const getJobOfferFTUsecase: GetJobOfferFTUsecase = GetJobOfferFTUsecaseImpl
const getJobOffersWTTJUsecase: GetJobOffersWTTJUsecase = GetJobOffersWTTJUsecaseimpl

router.get(
    "/ft",
    query("keywords").notEmpty().isString().escape(),
    query("cityCode").notEmpty().isString().escape(),
    cacheSuccesses,
    async (req: Request, res: Response) => {
        const validator = validationResult(req)
        if (!validator.isEmpty()) {
            return res.status(404).send("Inputs are missing.")
        }

        const result = await getJobOfferFTUsecase.perform({
            keywords: req.query.keywords as string,
            cityCode: req.query.cityCode as string,
        })

        if ("errorCode" in result && typeof result.errorCode === "number") {
            return res.status(result.errorCode).send(result)
        }

        res.status(200).send(result)
    }
)

router.get(
    "/wttj",
    query("keywords").notEmpty().isString().escape(),
    query("cityCode").notEmpty().isString().escape(),
    cacheSuccesses,
    async (req: Request, res: Response) => {
        const validator = validationResult(req)
        if (!validator.isEmpty()) {
            return res.status(404).send("Inputs are missing.")
        }

        const result = await getJobOffersWTTJUsecase.perform({
            keyWords: req.query.keywords as string,
            cityCode: req.query.cityCode as string,
        })

        if ("errorCode" in result && typeof result.errorCode === "number") {
            return res.status(result.errorCode).send(result)
        }

        res.status(200).send(result)
    }
)

export default router
