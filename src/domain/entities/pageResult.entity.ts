import JobOffer from "./jobOffer.entity"

export default interface PageOffers {
    id?: string
    jobOffers: JobOffer[]
    totalPagesNb: number
}
