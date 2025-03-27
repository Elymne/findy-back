import { Router } from "express"
import { updateJobsRoute } from "./updateJobs.route"

const updateRouter = Router()

updateRouter.use(updateJobsRoute)

export default updateRouter
