import { Failure, Result, Success, Usecase } from "../../../core/interfaces/abstract.usecase"
import { GetOneCityUsecase, GetOneCityUsecaseImpl } from "../cities/getOneCity.usecase"
import {
    PageOffersHWDatasource,
    PageOffersHWDatasourceImpl,
    FindAllByQueryHWParams,
} from "@App/infrastructure/remote/helloWork/datasources/jobOfferHW.datasource"
import { FilterPageOffersUsecase, FilterPageOffersUsecaseImpl } from "./filterPageOffers.usecase"
import logger from "@App/core/tools/logger"
import PageOffers from "@App/domain/entities/pageResult.entity"

export interface GetPageOffersHWUsecase extends Usecase<PageOffers, Params> {
    pageOffersHWDatasource: PageOffersHWDatasource
    getOneCityUsecase: GetOneCityUsecase
    filterJobOfferUsecase: FilterPageOffersUsecase
}

export const GetPageOffersHWUsecaseImpl: GetPageOffersHWUsecase = {
    pageOffersHWDatasource: PageOffersHWDatasourceImpl,
    getOneCityUsecase: GetOneCityUsecaseImpl,
    filterJobOfferUsecase: FilterPageOffersUsecaseImpl,

    perform: async function (params: Params): Promise<Result<PageOffers>> {
        try {
            const findAllByQueryHWParams: FindAllByQueryHWParams = {
                keyWords: params.keyWords,
                radius: params.radius,
                page: params.page,
                nbElement: params.nbElements,
                cityName: undefined,
            }

            if (params.cityCode) {
                const cityResult = await this.getOneCityUsecase.perform({ code: params.cityCode })
                if (cityResult instanceof Failure) {
                    return cityResult
                }
                findAllByQueryHWParams.cityName = cityResult.data.name
            }

            const pageOffersResult = await this.pageOffersHWDatasource.findAllByQuery(findAllByQueryHWParams)

            const pageOffersFilteredResult = await this.filterJobOfferUsecase.perform({
                sources: pageOffersResult,
            })

            if (pageOffersFilteredResult instanceof Failure) {
                return pageOffersFilteredResult
            }

            return new Success({
                message: "Job offers from HelloWork page fetched successfully",
                data: pageOffersFilteredResult.data,
            })
        } catch (error) {
            logger.error("[GetPageOffersHWUsecase]", error)
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
