import { Router } from "express";
import GetOffersFromSearchRoute from "./GetOffersFromSearch.route";

const offersRouter = Router();
offersRouter.use(GetOffersFromSearchRoute);
export default offersRouter;
