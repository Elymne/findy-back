import { Router } from "express"
import getAllJobOffersRoute from "./getAll.route"
import getWttjJobOffersRoute from "./getWttj.route"
import getSampleJobOffersRoute from "./getSample.route"

const jobOfferRouter = Router()

jobOfferRouter.use(getAllJobOffersRoute)
jobOfferRouter.use(getWttjJobOffersRoute)
jobOfferRouter.use(getSampleJobOffersRoute)

export default jobOfferRouter
