import DetailedOffer from "../models/DetailedOffer.model";
import Offer from "../models/Offer.model";

export default interface OfferRepository {
    findManyBySearch(keyWords: string, codeZone: string, distance: number | null): Promise<Offer[]>;
    findOne(id: string): Promise<DetailedOffer | null>;
}
