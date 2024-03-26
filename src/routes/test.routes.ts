import { JobOfferHWDatasource, JobOfferHWDatasourceImpl } from "@App/infrastructure/remote/helloWork/datasources/jobOfferHW.datasource"
import {
    JobOfferIndeedDatasource,
    JobOfferIndeedDatasourceImpl,
} from "@App/infrastructure/remote/indeed/datasources/jobOffersIndeed.datasource"
import express, { Request, Response } from "express"

const jobOfferIndeedDatasource: JobOfferIndeedDatasource = JobOfferIndeedDatasourceImpl

const testRouter = express.Router().get("/", async (req: Request, res: Response) => {
    const result = await jobOfferIndeedDatasource.findAllByQuery({ keyWords: "Marketing", cityName: "NANTES", radius: 30, page: 1 })
    res.status(200).send(result)
})

export default testRouter
