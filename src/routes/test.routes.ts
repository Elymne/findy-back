import { JobOfferHWDatasource, JobOfferHWDatasourceImpl } from "@App/infrastructure/remote/helloWork/datasources/jobOfferHW.datasource"
import express, { Request, Response } from "express"

const jobOfferHWDatasource: JobOfferHWDatasource = JobOfferHWDatasourceImpl

const testRouter = express.Router().get("/", async (req: Request, res: Response) => {
    const result = await jobOfferHWDatasource.findAllByQuery({ keyWords: "Marketing", cityName: "NANTES" })

    res.status(200).send(result)
})

export default testRouter
