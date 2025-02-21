import express, { Request, Response } from "express";
import { cache24hours } from "@App/infrastructure/express/middlewares/cache";
import { ResultType } from "@App/core/Usecase";
import OfferDatasource from "@App/infrastructure/datasources/france_travail/OfferDatasource";
import GetOneOffer from "@App/domain/usecases/GetOneOffer.usecase";

const getOneOffer = new GetOneOffer(new OfferDatasource());

const getOneOfferRoute = express.Router().get("/:id", cache24hours, async (req: Request, res: Response) => {
    const id = req.params.id ? (req.params.id as string) : null;
    if (!id) {
        res.status(400).send("couille");
        return;
    }

    const result = await getOneOffer.perform({
        id: id,
    });

    if (result.type == ResultType.FAILURE) {
        res.status(result.code).send(result.data);
        return;
    }

    res.status(result.code).send(result.data);
});

export default getOneOfferRoute;
