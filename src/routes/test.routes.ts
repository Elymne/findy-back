import express, { Request, Response } from "express"
import { JobOfferHWDatasource, JobOfferHWDatasourceImpl } from "@App/infrastructure/hw/datasources/jobOfferHW.datasource"

const router = express.Router()

const jobOfferHWDatasource: JobOfferHWDatasource = JobOfferHWDatasourceImpl

router.get("/", async (req: Request, res: Response) => {
    const result = await jobOfferHWDatasource.findAllByQuery({ keyWords: "Marketing", cityName: "NANTES" })

    res.status(200).send(result)
})

export default router
