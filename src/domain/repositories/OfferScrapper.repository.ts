import OfferScrap from "../models/scrap/Offer.scrap"

export default interface JobScrapperRepository {
    getOnePage(pageIndex: number): Promise<OfferScrap[]>
}
