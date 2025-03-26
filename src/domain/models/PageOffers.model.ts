import type Offer from "./Offer.model"

export default interface PageOffers {
    jobs: Offer[]
    currentPage: number
    maxPage: number
}
