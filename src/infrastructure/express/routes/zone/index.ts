import { Router } from "express"
import getZonesRoute from "./getZones.route"
import getZoneByIDRoute from "./getZoneByID.route"

const zoneRouter = Router()
zoneRouter.use(getZonesRoute)
zoneRouter.use(getZoneByIDRoute)

export default zoneRouter
