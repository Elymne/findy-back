import { Router } from "express"
import getSampleRoute from "../samples/getSample.route"

const sampleRouter = Router()

sampleRouter.use(getSampleRoute)

export default sampleRouter
