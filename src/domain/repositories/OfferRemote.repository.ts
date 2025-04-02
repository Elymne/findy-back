import Offer from "../models/clean/Offer.model"
import OfferDetailed from "../models/clean/OfferDetailed.model"

export default interface OfferRemoteRepository {
    findManyBySearch(params: FindManyBySearchParams): Promise<Offer[]>
    findOne(id: string): Promise<OfferDetailed | null>
}

type FindManyBySearchParams = {
    keyWords?: string
    codeZone?: string
    codeJob?: string
    distance?: number
}
