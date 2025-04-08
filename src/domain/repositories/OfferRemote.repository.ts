import OfferCrap from "../models/scrap/Offer.scrap"

export default interface OfferRemoteRepository {
    findAll(params: FindAllParams): Promise<OfferCrap[]>
}

type FindAllParams = {
    count?: number
    newestDate?: Date
}
