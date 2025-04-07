import { Router } from "express"
import { updateJobsRoute } from "./updateJobs.route"
import { updateZoneRoute } from "./updateZones.route"
import { updateOffersRoute } from "./updateOffers.route"

const updateRouter = Router()

updateRouter.use(updateJobsRoute)
updateRouter.use(updateZoneRoute)
updateRouter.use(updateOffersRoute)

export default updateRouter
