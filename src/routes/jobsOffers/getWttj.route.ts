import express, { Request, Response } from "express"
import { query, validationResult } from "express-validator"
import GetPageOffersWTTJUsecase, { GetPageOffersWTTJUSecaseImpl } from "@App/domain/usecases/jobsOffers/getPageOffersWTTJ.usecase"
import { Failure } from "@App/core/interfaces/abstract.usecase"
import { cache24hours } from "@App/core/tools/cache"

const getJobOffersWTTJUsecase: GetPageOffersWTTJUsecase = GetPageOffersWTTJUSecaseImpl

const getWttjJobOffersRoute = express
    .Router()
    .get(
        "/wttj",
        query("keywords").isString().notEmpty().escape(),
        query("cityCode").isString().escape(),
        query("page").isInt().optional({ values: "null" }),
        query("radius").isInt().optional({ values: "null" }),
        cache24hours,
        async (req: Request, res: Response) => {
            const validator = validationResult(req)
            if (!validator.isEmpty()) {
                res.status(404).send(validator)
                return
            }

            const result = await getJobOffersWTTJUsecase.perform({
                keyWords: req.query.keywords as string,
                cityCode: req.query.cityCode as string,
                radius: parseInt((req.query.radius ?? 20) as string),
                page: parseInt((req.query.page ?? 1) as string),
            })

            if (result instanceof Failure) {
                res.status(result.errorCode).send(result)
                return
            }

            res.status(200).send(result)
        }
    )

export default getWttjJobOffersRoute
