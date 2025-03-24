import { Router } from "express";
import scrapHelloworkPage from "./scrapHelloworkPage";

const scrapperRouter = Router();

scrapperRouter.use(scrapHelloworkPage);

export default scrapperRouter;
