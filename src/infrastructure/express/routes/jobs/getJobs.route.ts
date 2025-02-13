import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import { sampleCache } from "@App/infrastructure/express/middlewares/cache";
import { ResultType } from "@App/core/Usecase";
import GetJobs from "@App/domain/usecases/GetJobs.usecase";
import JobDatasource from "@App/infrastructure/datasources/JobCodeDatasource";

const getJobs: GetJobs = new GetJobs(new JobDatasource());

const getJobsRouter = express.Router().get("/", sampleCache, async (req: Request, res: Response) => {
    const validator = validationResult(req);
    if (!validator.isEmpty()) {
        res.status(404).send(validator);
        return;
    }

    const result = await getJobs.perform();

    if (result.type == ResultType.FAILURE) {
        res.status(result.code).send(result.data);
        return;
    }

    res.status(result.code).send(result.data);
});

export default getJobsRouter;
