import { Router } from "express";
import getZonesRoute from "./getZones.route";

const zoneRouter = Router();
zoneRouter.use(getZonesRoute);

export default zoneRouter;
