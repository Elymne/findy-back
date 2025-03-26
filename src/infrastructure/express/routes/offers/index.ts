import { Router } from "express"
import getOffersFromSearchRoute from "./getOffersFromSearch.route"
import getOneOfferRoute from "./getOffer.route"

const offerRouter = Router()

offerRouter.use(getOffersFromSearchRoute)
offerRouter.use(getOneOfferRoute)

export default offerRouter
