import { Router } from "express";
import GetSampleRoute from "./GetSample.route";
import getOffersFromSearchRoute from "./GetOffersFromSearch.route";

const offersRouter = Router();
offersRouter.use(getOffersFromSearchRoute);
offersRouter.use(GetSampleRoute);
export default offersRouter;
