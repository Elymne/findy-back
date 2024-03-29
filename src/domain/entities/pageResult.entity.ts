import JobOffer from "./jobOffer.entity"

export default interface PageResult {
    id?: string
    jobOffers: JobOffer[]
    totalPagesNb: number
}
