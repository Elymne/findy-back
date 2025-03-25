import Offer from "../models/Offer.model";

export default interface JobScrapperRepository {
    getOnePage(pageIndex: number): Promise<Offer[]>;
}
