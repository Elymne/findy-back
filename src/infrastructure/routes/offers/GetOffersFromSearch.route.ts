import express, { Request, Response } from "express";
import { query, validationResult } from "express-validator";
import { offersSearchCache } from "@App/core/cache";
import { Container } from "@App/domain/di/Container";
import GetOffersFromSearch from "@App/domain/usecases/GetOffersFromSearch.usecase";
import { Usecases } from "@App/domain/di/Injectable";
import { ResultType } from "@App/core/usecase";

const getOffersFromSearch = Container.get<GetOffersFromSearch>(Usecases.GetOffersFromSearch);

const GetOffersFromSearch = express
    .Router()
    .get(
        "/offers",
        query("keywords").isString().notEmpty().escape(),
        query("codezone").isString().notEmpty().escape(),
        query("distance").isInt().optional({ values: "null" }),
        query("page").isInt().optional({ values: "null" }),
        offersSearchCache,
        async (req: Request, res: Response) => {
            const validator = validationResult(req);
            if (!validator.isEmpty()) {
                res.status(404).send(validator);
                return;
            }

            const result = await getOffersFromSearch.perform({
                keywords: req.query.keywords as string,
                codeZone: req.query.cityCode as string,
                distance: parseInt((req.query.radius ?? 20) as string),
                page: parseInt((req.query.page ?? 1) as string),
            });

            if (result.type == ResultType.FAILURE) {
                res.status(500).send(result);
                return;
            }

            res.status(200).send(result);
        }
    );

export default GetOffersFromSearch;
