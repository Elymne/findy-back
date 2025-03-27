import { Failure, Result, Success } from "@App/core/Result"
import { Usecase } from "@App/core/Usecase"
import PageOffers from "@App/domain/models/PageOffers.model"
import OfferRemoteRepository from "@App/domain/repositories/OfferRemote.repository"
import OfferRemoteDatasource from "@App/infrastructure/datasources/francetravail/OfferRemoteDatasource"

//TODO rework total ou pas je sais ap.
export default class GetOffersFromSearch extends Usecase<PageOffers, GetOffersFromSearchParams> {
    private offerRepository: OfferRemoteRepository

    public constructor(offerDatasource: OfferRemoteDatasource) {
        super()
        this.offerRepository = offerDatasource
    }

    public async perform(params: GetOffersFromSearchParams): Promise<Result<PageOffers>> {
        try {
            const offers = await this.offerRepository.findManyBySearch({
                keyWords: params.keywords,
                codeZone: params.codeZone,
                codeJob: params.codeJob,
                distance: params.distance,
            })
            if (offers.length == 0) {
                return new Success(204, `[${this.constructor.name}] Trying to fetch offers : none found.`, {
                    jobs: offers,
                    currentPage: params.page ?? 0,
                    maxPage: 0,
                })
            }

            const indexStart = elementByPage * (params.page ? params.page - 1 : 0)
            const indexEnd = elementByPage * (params.page ? params.page : 1)
            if (offers.length < indexStart) {
                return new Success(204, `[${this.constructor.name}] Trying to fetch offers : the page asked does not exists.`, {
                    jobs: offers,
                    currentPage: params.page ?? 0,
                    maxPage: 0,
                })
            }

            const resultByPage = offers.slice(indexStart, indexEnd)
            const maxPage = Math.floor(offers.length / elementByPage)
            return new Success(200, `[${this.constructor.name}] Trying to fetch offers : success.`, {
                jobs: resultByPage,
                currentPage: params.page ?? 1,
                maxPage: maxPage,
            })
        } catch (trace) {
            return new Failure(500, `[${this.constructor.name}] An exception has been thrown.`, { message: "An internal error occured while fetching offers" }, trace)
        }
    }
}

const elementByPage: number = 20
interface GetOffersFromSearchParams {
    keywords?: string
    codeZone?: string
    codeJob?: string
    distance?: number
    page?: number
}
