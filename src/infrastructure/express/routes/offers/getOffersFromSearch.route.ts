import express, { Request, Response } from "express";
import { query, validationResult } from "express-validator";
import { cache10mins } from "@App/infrastructure/express/middlewares/cache";
import GetOffersFromSearch from "@App/domain/usecases/GetOffersFromSearch.usecase";
import OfferDatasource from "@App/infrastructure/datasources/OfferDatasource";
import { ResultType } from "@App/core/Usecase";

const getOffer: GetOffersFromSearch = new GetOffersFromSearch(new OfferDatasource());

const getOffersFromSearchRoute = express
    .Router()
    .get(
        "/",
        query("keywords").isString().notEmpty().escape(),
        query("codezone").isString().notEmpty().escape(),
        query("distance").isInt().optional({ values: "null" }),
        query("page").isInt().optional({ values: "null" }),
        cache10mins,
        async (req: Request, res: Response) => {
            const validator = validationResult(req);
            if (!validator.isEmpty()) {
                res.status(404).send(validator);
                return;
            }

            const result = await getOffer.perform({
                keywords: req.query.keywords as string,
                codeZone: req.query.codezone as string,
                distance: parseInt((req.query.radius ?? 20) as string),
                page: parseInt((req.query.page ?? 1) as string),
            });

            if (result.type == ResultType.FAILURE) {
                res.status(result.code).send(result.data);
                return;
            }

            res.status(result.code).send(result.data);
        }
    );

export default getOffersFromSearchRoute;
