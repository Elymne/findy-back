import { Failure, Result, Success } from "@App/core/Result"
import { Usecase } from "@App/core/Usecase"
import PageOffers from "@App/domain/models/clean/PageOffers.model"
import OfferLocalRepository from "@App/domain/repositories/OfferLocal.repository"

//TODO rework local.

export default class GetOffersFromSearch extends Usecase<PageOffers, GetOffersFromSearchParams> {
    private offerLocalRepository: OfferLocalRepository

    public constructor(offerLocalRepository: OfferLocalRepository) {
        super()
        this.offerLocalRepository = offerLocalRepository
    }

    public async perform(params: GetOffersFromSearchParams): Promise<Result<PageOffers>> {
        try {
            const offers = await this.offerLocalRepository.findMany({
                keyWords: params.keywords,
                codezone: params.codeZone,
                codejob: params.codeJob,
                range: "10-20",
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
type GetOffersFromSearchParams = {
    keywords?: string
    codeZone?: string
    codeJob?: string
    distance?: number
    page?: number
}
