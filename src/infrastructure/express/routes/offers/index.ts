import { Router } from "express";
import getOffersFromSearchRoute from "./getOffersFromSearch.route";
import getSampleRoute from "./getSample.route";
import getOneOfferRoute from "./getOffer.route";

const offerRouter = Router();
offerRouter.use(getOffersFromSearchRoute);
offerRouter.use(getOneOfferRoute);
offerRouter.use(getSampleRoute);
export default offerRouter;
