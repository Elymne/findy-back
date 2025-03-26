import { Router } from "express"
import getZonesRoute from "./getZones.route"
import getZonebyCodeRoute from "./getZoneByCode.route"

const zoneRouter = Router()
zoneRouter.use(getZonesRoute)
zoneRouter.use(getZonebyCodeRoute)

export default zoneRouter
