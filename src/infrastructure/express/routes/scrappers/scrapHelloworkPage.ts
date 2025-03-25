import express, { Request, Response } from "express";
import { query, validationResult } from "express-validator";
import HelloworkDatasource from "@App/infrastructure/datasources/scrappers/hellowork/HelloworkDatasource";
import ScrapOnePage from "@App/domain/usecases/scrapping/ScrapOnePage.usecase";
import ScrapPages from "@App/domain/usecases/scrapping/ScrapPages.usecase";

const scrapOnePage: ScrapOnePage = new ScrapOnePage(new HelloworkDatasource());
const scrapPages: ScrapPages = new ScrapPages(scrapOnePage);

export const scrapHelloworkPages = express
    .Router()
    .get("/hellowork", query("pagenumber").isInt().optional({ values: "null" }), query("maxday").isInt().optional({ values: "null" }), async (req: Request, res: Response) => {
        const validator = validationResult(req);
        if (!validator.isEmpty()) {
            res.status(400).send(validator);
            return;
        }

        const pageNumber = req.query.pagenumber ? parseInt(req.query.pagenumber as string) : undefined;
        const maxDay = req.query.maxday ? parseInt(req.query.maxday as string) : undefined;

        const jobs = await scrapPages.perform({
            pageNumber: pageNumber,
            maxDay: maxDay,
        });

        res.status(200).send(jobs.data);
    });

export const scrapHelloworkPage = express.Router().get("/hellowork/:index", async (req: Request, res: Response) => {
    const index = req.params.index ? parseInt(req.params.index as string) : null;
    if (!index) {
        res.status(400).send({
            message: `Bad request`,
            details: `The route that you are using need an page index. Actually it's ${req.params.index} that is given.`,
        });
        return;
    }

    const jobs = await scrapOnePage.perform({ pageIndex: index });
    res.status(200).send(jobs.data);
});
