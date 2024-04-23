import JobOffer from "./jobOffer.entity"

export default interface PageOffers {
    jobOffers: JobOffer[]
    totalPagesNb: number
}
