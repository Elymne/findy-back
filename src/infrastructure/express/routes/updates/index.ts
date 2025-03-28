import { Router } from "express"
import { updateJobsRoute } from "./updateJobs.route"
import { updateZoneRoute } from "./updateZones.route"

const updateRouter = Router()

updateRouter.use(updateJobsRoute)
updateRouter.use(updateZoneRoute)

export default updateRouter
