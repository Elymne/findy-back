import DetailedOffer from "../models/DetailedOffer.model";
import Offer from "../models/Offer.model";

export default interface OfferRepository {
    findManyBySearch(keyWords: string | null, codeZone: string | null, distance: number | null): Promise<Offer[]>;
    findOne(id: string): Promise<DetailedOffer | null>;
}
