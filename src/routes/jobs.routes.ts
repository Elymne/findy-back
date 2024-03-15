import express, { Request, Response } from "express"
import { query, validationResult } from "express-validator"
import { cacheSuccesses } from "@App/core/cache"
import { GetJobOfferFTUsecase, GetJobOfferFTUsecaseImpl } from "@App/domain/usecases/getJobOffersFT.usecase"
import { GetJobOffersWTTJUsecase, GetJobOffersWTTJUsecaseImpl } from "@App/domain/usecases/getJobOffersWTTJ.usecase"
import { GetJobOffersAllUsecase, GetJobOffersUsecaseImpl } from "@App/domain/usecases/getJobOffersAll.usecase"
import { Failure } from "@App/domain/usecases/abstract.usecase"
import { GetSampleFromFTUsecase, GetSampleFromFTUsecaseImpl } from "@App/domain/usecases/getSampleFromFT.usecase"
import { GetSampleFromWTTJUsecase, GetSampleFromWTTJUsecaseImpl } from "@App/domain/usecases/getSampleFromWTTJ.usecase"

const router = express.Router()
const getJobOffersUsecase: GetJobOffersAllUsecase = GetJobOffersUsecaseImpl
const getJobOffersWTTJUsecase: GetJobOffersWTTJUsecase = GetJobOffersWTTJUsecaseImpl
const getJobOfferFTUsecase: GetJobOfferFTUsecase = GetJobOfferFTUsecaseImpl
const getSampleJobOffersUsecase: GetSampleFromFTUsecase = GetSampleFromFTUsecaseImpl
const getSampleFromWTTJUsecase: GetSampleFromWTTJUsecase = GetSampleFromWTTJUsecaseImpl

router.get(
    "/all",
    query("keywords").isString().notEmpty().escape(),
    query("cityCode").isString().notEmpty().escape(),
    query("page").isInt().optional({ values: "null" }),
    query("radius").isInt().optional({ values: "null" }),
    cacheSuccesses,
    async (req: Request, res: Response) => {
        const validator = validationResult(req)
        if (!validator.isEmpty()) {
            res.status(404).send(validator)
            return
        }

        const result = await getJobOffersUsecase.perform({
            keyWords: req.query.keywords as string,
            cityCode: req.query.cityCode as string,
            page: parseInt((req.query.page ?? 1) as string),
            radius: parseInt((req.query.radius ?? 20) as string),
        })

        if (result instanceof Failure) {
            return res.status(result.errorCode).send(result)
        }

        res.status(200).send(result)
    }
)

router.get(
    "/wttj",
    query("keywords").isString().notEmpty().escape(),
    query("cityCode").isString().notEmpty().escape(),
    query("page").isInt().optional({ values: "null" }),
    query("radius").isInt().optional({ values: "null" }),
    cacheSuccesses,
    async (req: Request, res: Response) => {
        const validator = validationResult(req)
        if (!validator.isEmpty()) {
            res.status(404).send(validator)
            return
        }

        const result = await getJobOffersWTTJUsecase.perform({
            keyWords: req.query.keywords as string,
            cityCode: req.query.cityCode as string,
            page: parseInt((req.query.page ?? 1) as string),
            radius: parseInt((req.query.radius ?? 20) as string),
        })

        if (result instanceof Failure) {
            res.status(result.errorCode).send(result)
            return
        }

        res.status(200).send(result)
    }
)

router.get(
    "/ftapi",
    query("keywords").isString().notEmpty().escape(),
    query("cityCode").isString().notEmpty().escape(),
    query("page").isInt().optional({ values: "null" }),
    query("radius").isInt().optional({ values: "null" }),
    cacheSuccesses,
    async (req: Request, res: Response) => {
        const validator = validationResult(req)
        if (!validator.isEmpty()) {
            res.status(404).send(validator)
            return
        }

        const result = await getJobOfferFTUsecase.perform({
            keyWords: req.query.keywords as string,
            cityCode: req.query.cityCode as string,
            page: parseInt((req.query.page ?? 1) as string),
            radius: parseInt((req.query.radius ?? 20) as string),
        })

        if (result instanceof Failure) {
            res.status(result.errorCode).send(result)
            return
        }

        res.status(200).send(result)
    }
)

router.get("/ftapi/sample", cacheSuccesses, async (req: Request, res: Response) => {
    const result = await getSampleJobOffersUsecase.perform()

    if (result instanceof Failure) {
        return res.status(result.errorCode).send(result)
    }

    res.status(200).send(result)
})

router.get("/wttj/sample", cacheSuccesses, async (req: Request, res: Response) => {
    const result = await getSampleFromWTTJUsecase.perform()

    if (result instanceof Failure) {
        return res.status(result.errorCode).send(result)
    }

    res.status(200).send(result)
})

export default router
