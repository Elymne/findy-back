import GetZones from "@App/domain/usecases/GetZones.usecase";
import express, { Request, Response } from "express";
import { query, validationResult } from "express-validator";
import { cache24hours } from "../../middlewares/cache";
import { ResultType } from "@App/core/Usecase";
import ZoneDatasource from "@App/infrastructure/datasources/ZoneDatasource";

const getZones: GetZones = new GetZones(new ZoneDatasource());

const getZonesRoute = express.Router().get("/", query("text").isString().notEmpty().escape(), cache24hours, async (req: Request, res: Response) => {
    const validator = validationResult(req);
    if (!validator.isEmpty()) {
        res.status(400).send(validator);
        return;
    }

    const result = await getZones.perform({
        text: (req.query.text ?? "") as string,
    });

    if (result.type == ResultType.FAILURE) {
        res.status(result.code).send(result.data);
        return;
    }

    res.status(result.code).send(result.data);
});

export default getZonesRoute;
