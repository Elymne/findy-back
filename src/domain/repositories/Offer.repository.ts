import Offer from "../models/Offer.model";
import OfferDetailed from "../models/OfferDetailed.model";

export default interface OfferRepository {
    findManyBySearch(keyWords: string | null, codeZone: string | null, distance: number | null): Promise<Offer[]>;
    findOne(id: string): Promise<OfferDetailed | null>;
}
