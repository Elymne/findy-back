import { Router } from "express"
import getJobsRoute from "./getJobs.route"
import getJobByIDRoute from "./getJobByID.route"

const jobRouter = Router()

jobRouter.use(getJobsRoute)
jobRouter.use(getJobByIDRoute)

export default jobRouter
