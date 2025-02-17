import express, { Request, Response } from "express";
import { cache24hours } from "../../middlewares/cache";
import { ResultType } from "@App/core/Usecase";
import ZoneDatasource from "@App/infrastructure/datasources/france_travail/ZoneDatasource";
import GetZoneByCode from "@App/domain/usecases/GetZoneByCode.usecase";

const getZoneByCode: GetZoneByCode = new GetZoneByCode(new ZoneDatasource());

const getZonebyCodeRoute = express.Router().get("/:code", cache24hours, async (req: Request<{ code: string }>, res: Response) => {
    console.log(req.params.code);

    const result = await getZoneByCode.perform({
        code: (req.params.code ?? "") as string,
    });

    if (result.type == ResultType.FAILURE) {
        res.status(result.code).send(result.data);
        return;
    }

    res.status(result.code).send(result.data);
});

export default getZonebyCodeRoute;
