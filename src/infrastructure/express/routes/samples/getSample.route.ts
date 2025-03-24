import express, { Request, Response } from "express";
import { cache24hours } from "@App/infrastructure/express/middlewares/cache";
import { ResultType } from "@App/core/Usecase";
import GetSample from "@App/domain/usecases/GetSample";
import OfferDatasource from "@App/infrastructure/datasources/france_travail/OfferDatasource";

const getOfferSample: GetSample = new GetSample(new OfferDatasource());

const getSampleRoute = express.Router().get("/", cache24hours, async (req: Request, res: Response) => {
    const result = await getOfferSample.perform();

    if (result.type == ResultType.FAILURE) {
        res.status(result.code).send(result.data);
        return;
    }

    res.status(result.code).send(result.data);
});

export default getSampleRoute;
