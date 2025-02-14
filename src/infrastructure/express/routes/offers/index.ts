import { Router } from "express";
import getOffersFromSearchRoute from "./getOffersFromSearch.route";
import getSampleRoute from "./getSample.route";

const offerRouter = Router();
offerRouter.use(getOffersFromSearchRoute);
offerRouter.use(getSampleRoute);
export default offerRouter;
