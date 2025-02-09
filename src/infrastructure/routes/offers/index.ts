import { Router } from "express";
import getWttjJobOffersRoute from "./GetOffersFromSearch.route";

const jobOfferRouter = Router();

jobOfferRouter.use(getWttjJobOffersRoute);

export default jobOfferRouter;
