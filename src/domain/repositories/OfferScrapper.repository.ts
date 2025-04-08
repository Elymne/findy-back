import OfferScrap from "../models/scrap/Offer.scrap"

export default interface OfferScrapperRepository {
    getOnePage(pageIndex: number): Promise<OfferScrap[]>
}
