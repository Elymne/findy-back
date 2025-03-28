import express, { Request, Response } from "express"
import { cache24hours } from "@App/infrastructure/express/middlewares/cache"
import GetJobs from "@App/domain/usecases/fetching/GetJobs.usecase"
import { Failure, Success } from "@App/core/Result"
import JobLocalDatasource from "@App/infrastructure/datasources/mysql/JobLocalDatasource"

const getJobs: GetJobs = new GetJobs(new JobLocalDatasource())

const getJobsRoute = express.Router().get("/", cache24hours, async (req: Request, res: Response) => {
    const result = await getJobs.perform()

    if (result instanceof Failure) {
        res.status(result.code).send(result.error)
        return
    }

    if (result instanceof Success) {
        res.status(result.code).send(result.data)
        return
    }

    res.status(result.code).send({ message: "Unknown type of result." })
})

export default getJobsRoute
