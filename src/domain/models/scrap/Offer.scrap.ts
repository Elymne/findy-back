import { OfferOrigin } from "../clean/Offer.model"
import CompanyScrap from "./Company.scrap"
import ZoneScrap from "./Zone.scrap"
import JobScrap from "./Job.scrap"

export default interface OfferScrap {
    title?: string
    imgUrl?: string

    company?: CompanyScrap
    zone?: ZoneScrap
    job?: JobScrap

    tags: string[]

    createdAt?: Date
    updatedAt?: Date

    origin?: OfferOrigin
    originUrl?: string
}
