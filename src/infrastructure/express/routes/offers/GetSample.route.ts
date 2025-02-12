import express, { Request, Response } from "express";
import { query, validationResult } from "express-validator";
import { sampleCache } from "@App/infrastructure/express/middlewares/cache";
import { ResultType } from "@App/core/Usecase";
import GetOffersSample from "@App/domain/usecases/GetOffersSample.usecase";
import OfferDatasource from "@App/infrastructure/datasources/OfferDatasource";

const getOfferSample: GetOffersSample = new GetOffersSample(new OfferDatasource());

const GetSampleRoute = express.Router().get("/sample", query("code").isString().notEmpty().escape(), sampleCache, async (req: Request, res: Response) => {
    const validator = validationResult(req);
    if (!validator.isEmpty()) {
        res.status(404).send(validator);
        return;
    }

    const result = await getOfferSample.perform({
        code: +req.query.code!,
    });

    if (result.type == ResultType.FAILURE) {
        res.status(result.code).send(result.data);
        return;
    }

    res.status(result.code).send(result.data);
});

export default GetSampleRoute;
