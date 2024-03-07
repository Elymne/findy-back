import express, { Request, Response } from "express"
import { query, validationResult } from "express-validator"
import { cacheSuccesses } from "@App/core/tools/cache"
import { GetJobOfferFTUsecase, GetJobOfferFTUsecaseImpl } from "@App/domain/usecases/jobOffer/getJobOffersFT.usecase"
import { GetJobOffersWTTJUsecase, GetJobOffersWTTJUsecaseimpl } from "@App/domain/usecases/jobOffer/getJobOffersWTTJ.usecase"
import { GetJobOffersUsecase, GetJobOffersUsecaseImpl } from "@App/domain/usecases/jobOffer/getJobOffers.usecase"

const router = express.Router()
const getJobOfferFTUsecase: GetJobOfferFTUsecase = GetJobOfferFTUsecaseImpl
const getJobOffersWTTJUsecase: GetJobOffersWTTJUsecase = GetJobOffersWTTJUsecaseimpl
const getJobOffersUsecase: GetJobOffersUsecase = GetJobOffersUsecaseImpl

// TODO Faire un usecase qui fetch tout ce que l'on a pour l'instant.
router.get(
    "/",
    query("keywords").notEmpty().isString().escape(),
    query("cityCode").notEmpty().isString().escape(),
    query("page").isString().default("1"),
    cacheSuccesses,
    async (req: Request, res: Response) => {
        const validator = validationResult(req)
        if (!validator.isEmpty()) {
            return res.status(404).send(validator)
        }

        const result = await getJobOffersUsecase.perform({
            keyWords: req.query.keywords as string,
            cityCode: req.query.cityCode as string,
            page: parseInt(req.query.page as string),
        })

        if ("errorCode" in result && typeof result.errorCode === "number") {
            return res.status(result.errorCode).send(result)
        }

        res.status(200).send(result)
    }
)

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
            keyWords: req.query.keywords as string,
            cityCode: req.query.cityCode as string,
            page: 4,
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
            page: 40,
        })

        if ("errorCode" in result && typeof result.errorCode === "number") {
            return res.status(result.errorCode).send(result)
        }

        res.status(200).send(result)
    }
)

export default router
