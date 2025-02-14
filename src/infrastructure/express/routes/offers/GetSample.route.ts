import express, { Request, Response } from "express";
import { query, validationResult } from "express-validator";
import { cache24hours } from "@App/infrastructure/express/middlewares/cache";
import { ResultType } from "@App/core/Usecase";
import GetSample from "@App/domain/usecases/GetSample";
import OfferDatasource from "@App/infrastructure/datasources/OfferDatasource";

const getOfferSample: GetSample = new GetSample(new OfferDatasource());

const getSampleRoute = express.Router().get("/sample", query("code").isString().notEmpty().escape(), cache24hours, async (req: Request, res: Response) => {
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

export default getSampleRoute;
