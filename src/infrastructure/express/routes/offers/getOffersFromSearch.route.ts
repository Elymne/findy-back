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
        query("keywords").isString().optional().escape(),
        query("codezone").isString().optional().escape(),
        query("distance").isInt().optional({ values: "null" }),
        query("page").isInt().optional({ values: "null" }),
        cache10mins,
        async (req: Request, res: Response) => {
            const validator = validationResult(req);
            if (!validator.isEmpty()) {
                res.status(400).send(validator);
                return;
            }

            const keywords = req.query.keywords ? (req.query.keywords as string) : null;
            const codeZone = req.query.codeZone ? (req.query.codeZone as string) : null;
            const distance = req.query.distance ? parseInt(req.query.distance as string) : null;
            const page = req.query.page ? parseInt(req.query.page as string) : null;

            const result = await getOffer.perform({
                keywords: keywords,
                codeZone: codeZone,
                distance: distance,
                page: page,
            });

            if (result.type == ResultType.FAILURE) {
                res.status(result.code).send(result.data);
                return;
            }

            res.status(result.code).send(result.data);
        }
    );

export default getOffersFromSearchRoute;
