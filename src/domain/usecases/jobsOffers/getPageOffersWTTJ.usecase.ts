import { Failure, Result, Success, Usecase } from "@App/core/interfaces/abstract.usecase"
import PageOffersWTTJDatasource, {
    FindAllByQueryWTTJParams,
    PageOffersWTTJDatasourceImpl,
} from "@App/infrastructure/remote/welcomeToTheJungle/jobOfferWTTJ.datasource"
import GetOneCityByCodeUsecase, { GetOneCityByCodeUsecaseImpl } from "../cities/getOneCityByCode.usecase"
import FilterPageOffersUsecase, { FilterPageOffersUsecaseImpl } from "./filterPageOffers.usecase"
import PageOffers from "@App/domain/entities/pageResult.entity"
import logger from "@App/core/tools/logger"

export default interface GetPageOffersWTTJUsecase extends Usecase<PageOffers, Params> {
    pageOffersWTTJDatasource: PageOffersWTTJDatasource
    getOneCityByCodeUsecase: GetOneCityByCodeUsecase
    filterPageOffersUsecase: FilterPageOffersUsecase
}

export const GetPageOffersWTTJUSecaseImpl: GetPageOffersWTTJUsecase = {
    pageOffersWTTJDatasource: PageOffersWTTJDatasourceImpl,
    getOneCityByCodeUsecase: GetOneCityByCodeUsecaseImpl,
    filterPageOffersUsecase: FilterPageOffersUsecaseImpl,

    perform: async function (params: Params): Promise<Result<PageOffers>> {
        try {
            const findAllByQueryWTTJParams: FindAllByQueryWTTJParams = {
                keyWords: params.keyWords,
                page: params.page,
                radius: params.radius,
                lat: undefined,
                lng: undefined,
            }

            if (params.cityCode) {
                const cityResult = await this.getOneCityByCodeUsecase.perform({ code: params.cityCode })
                if (cityResult instanceof Failure) {
                    return cityResult
                }
                findAllByQueryWTTJParams.lat = cityResult.data.coordinates.lat
                findAllByQueryWTTJParams.lng = cityResult.data.coordinates.lng
            }

            const pageOffersResult = await this.pageOffersWTTJDatasource.findAllByQuery(findAllByQueryWTTJParams)

            const pageOffersFilteredResult = await this.filterPageOffersUsecase.perform({ sources: pageOffersResult })

            if (pageOffersFilteredResult instanceof Failure) {
                return pageOffersFilteredResult
            }

            return new Success({
                message: "Job offers from WelcomeToTheJungle page fetched successfully",
                data: pageOffersFilteredResult.data,
            })
        } catch (error) {
            logger.error("[GetPageOffersWTTJUsecase]", error)
            return new Failure({
                message: "An internal error occur",
                errorCode: 500,
            })
        }
    },
}

type Params = {
    keyWords: string
    cityCode?: string
    page?: number
    radius?: number
}
