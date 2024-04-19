import express, { Request, Response } from "express"
import { query, validationResult } from "express-validator"
import GetPageOffersUsecase, { GetPageOffersUsecaseImpl } from "@App/domain/usecases/jobsOffers/getPageOffers.usecase"
import { Failure } from "@App/core/interfaces/abstract.usecase"
import { cache24hours } from "@App/core/tools/cache"

const getJobOffersUsecase: GetPageOffersUsecase = GetPageOffersUsecaseImpl

const getAllJobOffersRoute = express
    .Router()
    .get(
        "/",
        query("keywords").isString().notEmpty().escape(),
        query("cityCode").isString().notEmpty().escape(),
        query("page").isInt().optional({ values: "null" }),
        query("radius").isInt().optional({ values: "null" }),
        cache24hours,
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

export default getAllJobOffersRoute
