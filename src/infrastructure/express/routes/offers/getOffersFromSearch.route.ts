import express, { Request, Response } from "express";
import { query, validationResult } from "express-validator";
import { cache10mins } from "@App/infrastructure/express/middlewares/cache";
import OfferDatasource from "@App/infrastructure/datasources/france_travail/OfferDatasource";
import { ResultType } from "@App/core/Usecase";
import GetOffersFromSearch from "@App/domain/usecases/fetching/GetOffersFromSearch.usecase";

const getOffer: GetOffersFromSearch = new GetOffersFromSearch(new OfferDatasource());

const getOffersFromSearchRoute = express
    .Router()
    .get(
        "/",
        query("keywords").isString().optional({ values: "null" }).escape(),
        query("codezone").isString().optional({ values: "null" }).escape(),
        query("codejob").isString().optional({ values: "null" }).escape(),
        query("distance").isString().optional({ values: "null" }),
        query("page").isString().optional({ values: "null" }),
        cache10mins,
        async (req: Request, res: Response) => {
            const validator = validationResult(req);
            if (!validator.isEmpty()) {
                res.status(400).send(validator);
                return;
            }

            const keywords = req.query.keywords ? (req.query.keywords as string) : undefined;
            const codeZone = req.query.codezone ? (req.query.codezone as string) : undefined;
            const codeJob = req.query.codejob ? (req.query.codejob as string) : undefined;
            const distance = req.query.distance ? parseInt(req.query.distance as string) : undefined;
            const page = req.query.page ? parseInt(req.query.page as string) : undefined;

            const result = await getOffer.perform({
                keywords: keywords,
                codeZone: codeZone,
                codeJob: codeJob,
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
