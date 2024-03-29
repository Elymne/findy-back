import {
    PageOffersIndeedDatasource,
    PageOffersIndeedDatasourceImpl,
    FindAllByQueryIndeedParams,
} from "@App/infrastructure/remote/indeed/datasources/jobOffersIndeed.datasource"
import { GetOneCityUsecase, GetOneCityUsecaseImpl } from "../cities/getOneCity.usecase"
import { FilterPageOffersUsecase, FilterPageOffersUsecaseImpl } from "./filterPageOffers.usecase"
import { Failure, Result, Success, Usecase } from "@App/core/interfaces/abstract.usecase"
import logger from "@App/core/tools/logger"
import PageOffers from "@App/domain/entities/pageResult.entity"

export interface GetPageOffersIndeedUsecase extends Usecase<PageOffers, Params> {
    pageOffersIndeedDatasource: PageOffersIndeedDatasource
    getOneCityUsecase: GetOneCityUsecase
    filterPageOffersUsecase: FilterPageOffersUsecase
}

export const GetPageOffersIndeedUsecaseImpl: GetPageOffersIndeedUsecase = {
    pageOffersIndeedDatasource: PageOffersIndeedDatasourceImpl,
    getOneCityUsecase: GetOneCityUsecaseImpl,
    filterPageOffersUsecase: FilterPageOffersUsecaseImpl,

    perform: async function (params: Params): Promise<Result<PageOffers>> {
        try {
            const query: FindAllByQueryIndeedParams = {
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
                query.cityName = cityResult.data.name
            }

            const pageOffersResult = await this.pageOffersIndeedDatasource.findAllByQuery(query)

            const pageOffersFilteredResult = await this.filterPageOffersUsecase.perform({
                sources: pageOffersResult,
            })

            if (pageOffersFilteredResult instanceof Failure) {
                return pageOffersFilteredResult
            }

            return new Success({
                message: "Job offers from Indeed page fetched successfully",
                data: pageOffersFilteredResult.data,
            })
        } catch (error) {
            logger.error("[GetPageOffersIndeedUsecase]", error)
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
