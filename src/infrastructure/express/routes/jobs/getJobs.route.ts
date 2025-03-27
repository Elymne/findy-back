import express, { Request, Response } from "express"
import { cache24hours } from "@App/infrastructure/express/middlewares/cache"
import JobRemoteDatasource from "@App/infrastructure/datasources/francetravail/JobRemoteDatasource"
import GetJobs from "@App/domain/usecases/fetching/GetJobs.usecase"
import { Failure, Success } from "@App/core/Result"

const getJobs: GetJobs = new GetJobs(new JobRemoteDatasource())

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
