import express, { Request, Response } from "express"
import { query, validationResult } from "express-validator"
import { Failure, Success } from "~/core/usecase"
import { JobOffer } from "~/domain/entities/jobOffer.entity"
import { GetJobOfferFTUsecase, GetJobOfferFTUsecaseImpl } from "~/domain/usecases/getJobOffersFT.usecase"

const router = express.Router()
const getJobOfferFTUsecaseImpl: GetJobOfferFTUsecase = GetJobOfferFTUsecaseImpl

// municode : 21704
// keyword : cuisine

router.get("/", query("keywords").notEmpty().isString().escape(), query("municipalityCode").notEmpty().isString().escape(), async (req: Request, res: Response) => {
    const validator = validationResult(req)
    if (!validator.isEmpty()) {
        return res.status(404).send("Inputs are missing.")
    }

    const result = await getJobOfferFTUsecaseImpl.perform({})

    if ("errorCode" in result) {
        return res.status(500).send(result as Failure<JobOffer[]>)
    }

    res.status(200).send(result as Success<JobOffer[]>)
})

export default router
