import { Router } from "express"
import getAllJobOffersRoute from "./getAll.route"
import getWttjJobOffersRoute from "./getWttj.route"
import getHwJobOffersRoute from "./getHW.route"
import getSampleJobOffersRoute from "./getSample.route"

const jobOfferRouter = Router()

jobOfferRouter.use(getAllJobOffersRoute)
jobOfferRouter.use(getWttjJobOffersRoute)
jobOfferRouter.use(getHwJobOffersRoute)
jobOfferRouter.use(getSampleJobOffersRoute)

export default jobOfferRouter
