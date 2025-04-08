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
            const elementByPage = 20
            const indexStart = elementByPage * (params.page ? params.page - 1 : 0)
            const indexEnd = elementByPage * (params.page ? params.page : 1)

            const count = await this.offerLocalRepository.count({
                keyWords: params.keywords,
                codezone: params.codeZone,
                codejob: params.codeJob,
            })

            if (count < indexStart) {
                return new Success(200, `[${this.constructor.name}] Trying to fetch offers : the page asked does not exists.`, {
                    jobs: [],
                    currentPage: params.page ?? 0,
                    maxPage: 0,
                })
            }

            const offers = await this.offerLocalRepository.findMany({
                keyWords: params.keywords,
                codezone: params.codeZone,
                codejob: params.codeJob,
                range: `${indexStart}-${indexEnd}`,
            })

            if (offers.length == 0) {
                return new Success(200, `[${this.constructor.name}] Trying to fetch offers : none found.`, {
                    jobs: offers,
                    currentPage: params.page ?? 0,
                    maxPage: 0,
                })
            }

            const maxPage = Math.floor(offers.length / count)

            return new Success(200, `[${this.constructor.name}] Trying to fetch offers : success.`, {
                offers: offers,
                currentPage: params.page ?? 1,
                maxPage: maxPage,
            })
        } catch (trace) {
            return new Failure(500, `[${this.constructor.name}] An exception has been thrown.`, { message: "An internal error occured while fetching offers" }, trace)
        }
    }
}

type GetOffersFromSearchParams = {
    keywords?: string
    codeZone?: string
    codeJob?: string
    distance?: number
    page?: number
}
