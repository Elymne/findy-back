import express, { Request, Response } from "express"
import { query, validationResult } from "express-validator"
import { GetJobOfferFTUsecase, GetJobOfferFTUsecaseImpl } from "~/domain/usecases/getJobOffersFT.usecase"
import { JobOfferWTTJDatasourceImpl } from "~/infrastructure/datasources/wttj/jobOfferWTTJ.datasource"

const router = express.Router()
const getJobOfferFTUsecase: GetJobOfferFTUsecase = GetJobOfferFTUsecaseImpl

// municode : 21704
// keyword : cuisine

router.get("/", query("keywords").notEmpty().isString().escape(), query("municipalityCode").notEmpty().isString().escape(), async (req: Request, res: Response) => {
    const validator = validationResult(req)
    if (!validator.isEmpty()) {
        return res.status(404).send("Inputs are missing.")
    }

    const result = await getJobOfferFTUsecase.perform({
        municipalityCode: req.query.municipalityCode as string,
        keywords: req.query.keywords as string,
    })

    if ("errorCode" in result && typeof result.errorCode === "number") {
        return res.status(result.errorCode).send(result)
    }

    res.status(200).send(result)
})

router.get("/testing", async (req: Request, res: Response) => {
    const jobOffers = await JobOfferWTTJDatasourceImpl.findAllShort()
    res.status(200).send(jobOffers)
})

export default router
