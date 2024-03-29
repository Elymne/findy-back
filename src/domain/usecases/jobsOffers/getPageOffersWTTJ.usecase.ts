import { GetOneCityUsecase, GetOneCityUsecaseImpl } from "../cities/getOneCity.usecase"
import { FilterPageOffersUsecase, FilterPageOffersUsecaseImpl } from "./filterPageOffers.usecase"
import { Failure, Result, Success, Usecase } from "../../../core/interfaces/abstract.usecase"
import logger from "@App/core/tools/logger"
import {
    PageOffersWTTJDatasource,
    PageOffersWTTJDatasourceImpl,
    FindAllByQueryWTTJParams,
} from "@App/infrastructure/remote/welcomeToTheJungle/datasources/jobOfferWTTJ.datasource"
import PageOffers from "@App/domain/entities/pageResult.entity"

export interface GetPageOffersWTTJUsecase extends Usecase<PageOffers, Params> {
    pageOffersWTTJDatasource: PageOffersWTTJDatasource
    getOneCityUsecase: GetOneCityUsecase
    filterPageOffersUsecase: FilterPageOffersUsecase
}

export const GetPageOffersWTTJUSecaseImpl: GetPageOffersWTTJUsecase = {
    pageOffersWTTJDatasource: PageOffersWTTJDatasourceImpl,
    getOneCityUsecase: GetOneCityUsecaseImpl,
    filterPageOffersUsecase: FilterPageOffersUsecaseImpl,

    perform: async function (params: Params): Promise<Result<PageOffers>> {
        try {
            const findAllByQueryWTTJParams: FindAllByQueryWTTJParams = {
                keyWords: params.keyWords,
                page: params.page,
                radius: params.radius,
                nbElement: params.nbElements,
                lat: undefined,
                lng: undefined,
            }

            if (params.cityCode) {
                const cityResult = await this.getOneCityUsecase.perform({ code: params.cityCode })
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
    nbElements?: number
}
