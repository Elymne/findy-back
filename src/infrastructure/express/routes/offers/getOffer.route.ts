import express, { Request, Response } from "express";
import { cache24hours } from "@App/infrastructure/express/middlewares/cache";
import OfferRemoteDatasource from "@App/infrastructure/datasources/france_travail/OfferDatasource";
import GetOneOffer from "@App/domain/usecases/fetching/GetOneOffer.usecase";

const getOneOffer = new GetOneOffer(new OfferRemoteDatasource());

const getOneOfferRoute = express.Router().get("/:id", cache24hours, async (req: Request, res: Response) => {
    const id = req.params.id ? (req.params.id as string) : null;
    if (!id) {
        res.status(400).send({
            message: `Bad request`,
            details: `The route that you are using need an id. Actually it's ${req.params.id} that is given.`,
        });
        return;
    }

    const result = await getOneOffer.perform({ id: id });
    res.status(result.code).send(result.data);
});

export default getOneOfferRoute;
