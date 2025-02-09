import express, { Request, Response } from "express";
import { query, validationResult } from "express-validator";
import { sampleCache } from "@App/core/cache";
import { ResultType } from "@App/core/usecase";
import { GetOffersSample } from "@App/domain/usecases/GetOffersSample.usecase";

const GetSampleRoute = express.Router().get("/sample", query("code").isString().notEmpty().escape(), sampleCache, async (req: Request, res: Response) => {
    const validator = validationResult(req);
    if (!validator.isEmpty()) {
        res.status(404).send(validator);
        return;
    }

    const result = await GetOffersSample.perform(+req.query.code!);

    if (result.type == ResultType.FAILURE) {
        res.status(result.code).send(result);
        return;
    }

    res.status(result.code).send(result);
});

export default GetSampleRoute;
