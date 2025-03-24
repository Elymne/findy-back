import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import { cache24hours } from "@App/infrastructure/express/middlewares/cache";
import { ResultType } from "@App/core/Usecase";
import JobDatasource from "@App/infrastructure/datasources/france_travail/JobCodeDatasource";
import GetJobs from "@App/domain/usecases/fetching/GetJobs.usecase";

const getJobs: GetJobs = new GetJobs(new JobDatasource());

const getJobsRouter = express.Router().get("/", cache24hours, async (req: Request, res: Response) => {
    const validator = validationResult(req);
    if (!validator.isEmpty()) {
        res.status(400).send(validator);
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
