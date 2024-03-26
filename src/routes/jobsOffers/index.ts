import { Router } from "express"
import getAllJobOffersRoute from "./getAll.route"
import getWttjJobOffersRoute from "./getWttj.route"
import getHwJobOffersRoute from "./getHW.route"
import getSampleJobOffersRoute from "./getSample.route"
import getIndeedJobOffersRoute from "./getIndeed.route"

const jobOfferRouter = Router()

jobOfferRouter.use(getAllJobOffersRoute)
jobOfferRouter.use(getWttjJobOffersRoute)
jobOfferRouter.use(getHwJobOffersRoute)
jobOfferRouter.use(getSampleJobOffersRoute)
jobOfferRouter.use(getIndeedJobOffersRoute)

export default jobOfferRouter
