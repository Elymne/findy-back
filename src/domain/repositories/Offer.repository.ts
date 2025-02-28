import Offer from "../models/Offer.model";
import OfferDetailed from "../models/OfferDetailed.model";

export default interface OfferRepository {
    findManyBySearch(params: FindManyBySearchParams): Promise<Offer[]>;
    findOne(id: string): Promise<OfferDetailed | null>;
}

type FindManyBySearchParams = {
    keyWords?: string;
    codeZone?: string;
    codeJob?: string;
    distance?: number;
};
