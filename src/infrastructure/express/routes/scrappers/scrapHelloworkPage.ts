import ScrapOnePage from "@App/domain/usecases/scrapping/ScrapOnePage.usecase";
import { HelloworkDatasource } from "@App/infrastructure/datasources/scrappers/hellowork/HelloworkDatasource";
import express, { Request, Response } from "express";

const scrapOnePage: ScrapOnePage = new ScrapOnePage(new HelloworkDatasource());

const scrapHelloworkPage = express.Router().get("/hellowork/:id", async (req: Request, res: Response) => {
    const jobs = await scrapOnePage.perform({ pageIndex: 1 });

    res.status(200).send(jobs);
});

export default scrapHelloworkPage;
