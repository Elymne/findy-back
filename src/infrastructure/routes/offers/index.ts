import { Router } from "express";
import GetOffersFromSearchRoute from "./GetOffersFromSearch.route";
import GetSampleRoute from "./GetSample.route";

const offersRouter = Router();
offersRouter.use(GetOffersFromSearchRoute);
offersRouter.use(GetSampleRoute);
export default offersRouter;
