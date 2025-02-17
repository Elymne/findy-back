import Offer from "../models/Offer.model";

export default interface ScrappedOfferRepository {
    findManyBySearch(keyWords: string | null, codeZone: string | null, distance: number | null): Promise<Offer[]>;
}
