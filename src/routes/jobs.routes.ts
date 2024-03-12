import express, { Request, Response } from "express"
import { query, validationResult } from "express-validator"
import { cacheSuccesses } from "@App/core/tools/cache"
import { GetJobOfferFTUsecase, GetJobOfferFTUsecaseImpl } from "@App/domain/usecases/getJobOffersFT.usecase"
import { GetJobOffersWTTJUsecase, GetJobOffersWTTJUsecaseImpl } from "@App/domain/usecases/getJobOffersWTTJ.usecase"
import { GetJobOffersAllUsecase, GetJobOffersUsecaseImpl } from "@App/domain/usecases/getJobOffersAll.usecase"
import { Failure } from "@App/core/usecase"

const router = express.Router()
const getJobOfferFTUsecase: GetJobOfferFTUsecase = GetJobOfferFTUsecaseImpl
const getJobOffersWTTJUsecase: GetJobOffersWTTJUsecase = GetJobOffersWTTJUsecaseImpl
const getJobOffersUsecase: GetJobOffersAllUsecase = GetJobOffersUsecaseImpl

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
            res.status(404).send(validator)
            return
        }

        const result = await getJobOffersUsecase.perform({
            keyWords: req.query.keywords as string,
            cityCode: req.query.cityCode as string,
            page: parseInt(req.query.page as string),
        })

        if (result instanceof Failure) {
            return res.status(result.errorCode).send(result)
        }

        res.status(200).send(result)
    }
)

router.get(
    "/ftapi",
    query("keywords").notEmpty().isString().escape(),
    query("page").notEmpty().isString().escape(),
    query("cityCode").isString().escape().optional({ nullable: true }),

    cacheSuccesses,
    async (req: Request, res: Response) => {
        const validator = validationResult(req)
        if (!validator.isEmpty()) {
            res.status(404).send(validator)
            return
        }

        const result = await getJobOfferFTUsecase.perform({
            keyWords: req.query.keywords as string,
            page: parseInt(req.query.page as string),
            cityCode: req.query.cityCode as string,
        })

        if (result instanceof Failure) {
            res.status(result.errorCode).send(result)
            return
        }

        res.status(200).send(result)
    }
)

router.get(
    "/wttj",
    query("keywords").notEmpty().isString().escape(),
    query("cityCode").notEmpty().isString().escape(),
    query("page").isString().default("1"),
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
            page: parseInt(req.query.page as string),
        })

        if (result instanceof Failure) {
            res.status(result.errorCode).send(result)
            return
        }

        res.status(200).send(result)
    }
)

export default router
