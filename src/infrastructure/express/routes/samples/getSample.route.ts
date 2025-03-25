import express, { Request, Response } from "express";
import { cache24hours } from "@App/infrastructure/express/middlewares/cache";
import OfferRemoteDatasource from "@App/infrastructure/datasources/france_travail/OfferDatasource";
import GetSample from "@App/domain/usecases/fetching/GetSample";

const getOfferSample: GetSample = new GetSample(new OfferRemoteDatasource());

const getSampleRoute = express.Router().get("/", cache24hours, async (req: Request, res: Response) => {
    const result = await getOfferSample.perform();
    res.status(result.code).send(result.data);
});

export default getSampleRoute;
