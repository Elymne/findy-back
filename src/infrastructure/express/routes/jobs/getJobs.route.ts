import express, { Request, Response } from "express"
import { cache24hours } from "@App/infrastructure/express/middlewares/cache"
import JobRemoteDatasource from "@App/infrastructure/datasources/remote/france_travail/JobCodeDatasource"
import GetJobs from "@App/domain/usecases/fetching/GetJobs.usecase"

const getJobs: GetJobs = new GetJobs(new JobRemoteDatasource())

const getJobsRoute = express.Router().get("/", cache24hours, async (req: Request, res: Response) => {
    const result = await getJobs.perform()
    res.status(result.code).send(result.data)
})

export default getJobsRoute
