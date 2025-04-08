import express, { Request, Response } from "express"
import { Failure, Success } from "@App/core/Result"
import UpdateJobs from "@App/domain/usecases/storing/UpdateJobs.usecase"
import JobLocalDatasource from "@App/infrastructure/datasources/mysql/JobLocalDatasource"
import JobFTDatasource from "@App/infrastructure/datasources/francetravail/JobFTDatasource"

const updateJobs = new UpdateJobs(new JobLocalDatasource(), new JobFTDatasource())
export const updateJobsRoute = express.Router().get("/jobs", async (req: Request, res: Response) => {
    const result = await updateJobs.perform()
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
