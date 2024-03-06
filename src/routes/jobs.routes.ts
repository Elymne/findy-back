import express, { Request, Response } from "express"
import { query, validationResult } from "express-validator"
import { cacheSuccesses } from "@App/core/tools/cache"
import { GetJobOfferFTUsecase, GetJobOfferFTUsecaseImpl } from "@App/domain/usecases/jobOffer/getJobOffersFT.usecase"
import { GetJobOffersWTTJUsecase, GetJobOffersWTTJUsecaseimpl } from "@App/domain/usecases/jobOffer/getJobOffersWTTJ.usecase"
import { JobOfferDatasource, JobOfferDatasourceImpl } from "@App/infrastructure/datasources/local/jobOffer.datasource"
import { JobOffer } from "@App/domain/entities/jobOffer.entity"
import { SourceData } from "@App/domain/entities/enums/sourceData.enum"
import { uuid } from "@App/core/tools/uuid"

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

const jobOfferDatasourceImpl: JobOfferDatasource = JobOfferDatasourceImpl

router.get("/test", async (req: Request, res: Response) => {
    console.log(uuid())
    console.log(uuid())
    console.log(uuid())

    const jobs: JobOffer[] = [
        {
            id: uuid(),
            title: "TITS",
            city_name: "Somewhere",
            company_logo_url: "logos",
            company_name: "Bibouchka",
            image_url: "bibabux",
            source_data: SourceData.WTTJ,
            source_url: "bibabux",
            created_while: "",
            created_at: undefined,
            updated_at: undefined,
        },
        {
            id: uuid(),
            title: "TITS",
            city_name: "Somewhere",
            company_logo_url: "logos",
            company_name: "Bibouchka",
            image_url: "bibabux",
            source_data: SourceData.WTTJ,
            source_url: "bibabux",
            created_while: "",
            created_at: undefined,
            updated_at: undefined,
        },
        {
            id: uuid(),
            title: "TITS",
            city_name: "Somewhere",
            company_logo_url: "logos",
            company_name: "Bibouchka",
            image_url: "bibabux",
            source_data: SourceData.WTTJ,
            source_url: "bibabux",
            created_while: "",
            created_at: undefined,
            updated_at: undefined,
        },
    ]

    try {
        const result = await jobOfferDatasourceImpl.addMany(jobs)
        res.status(200).send(result)
    } catch (e) {
        console.error(e)
        res.status(500).send(e)
    }
})

export default router
