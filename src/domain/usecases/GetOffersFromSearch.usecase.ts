import { Result, ResultType, Usecase } from "@App/core/Usecase";
import PageOffers from "../models/PageOffers.model";
import OfferDatasource from "@App/infrastructure/datasources/OfferDatasource";

export default class GetOffersFromSearch extends Usecase<PageOffers, GetOffersFromSearchParams> {
    private offerDatasource: OfferDatasource;

    public constructor(offerDatasource: OfferDatasource) {
        super();
        this.offerDatasource = offerDatasource;
    }

    public async perform(params: GetOffersFromSearchParams): Promise<Result<PageOffers>> {
        try {
            const offers = await this.offerDatasource.findManyBySearch(params.keywords, params.codeZone, params.distance);
            if (offers.length == 0) {
                return new Result<PageOffers>(ResultType.SUCCESS, 204, "[GetOffersFromSearch] No offers found.", null, null);
            }

            const indexStart = elementByPage * (params.page ? params.page - 1 : 0);
            const indexEnd = elementByPage * (params.page ? params.page : 1);

            if (offers.length < indexStart) {
                return new Result<PageOffers>(ResultType.SUCCESS, 204, "[GetOffersFromSearch] The page requested doesn't exists.", null, null);
            }

            const resultByPage = offers.slice(indexStart, indexEnd);
            const maxPage = Math.floor(offers.length / elementByPage);
            return new Result<PageOffers>(
                ResultType.SUCCESS,
                200,
                "[GetOffersFromSearch] Offers founded successfully.",
                {
                    jobs: resultByPage,
                    currentPage: params.page ?? 1,
                    maxPage: maxPage,
                },
                null
            );
        } catch (err) {
            return new Result<PageOffers>(ResultType.FAILURE, 500, "[GetOffersFromSearch] An exception has been throw. Check logs.", null, err);
        }
    }
}

const elementByPage: number = 20;
interface GetOffersFromSearchParams {
    keywords: string | null;
    codeZone: string | null;
    distance: number | null;
    page: number | null;
}
