import Company from "./Company.model"
import Job from "./Job.model"
import Zone from "./Zone.model"

export default interface Offer {
    id: string
    title: string
    imgUrl: string | undefined

    company: Company
    zone: Zone
    job: Job

    tags: string[]

    createdAt: Date
    updatedAt: Date | undefined

    origin: OfferOrigin | undefined
    originUrl: string | undefined
}

export enum OfferOrigin {
    HELLOWORK,
    INDEED,
    FRANCE_TRAVAIL,
}
