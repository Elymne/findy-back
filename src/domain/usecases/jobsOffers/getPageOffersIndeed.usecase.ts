import { FilterPageOffersUsecase, FilterPageOffersUsecaseImpl } from "./filterPageOffers.usecase"
import { Failure, Result, Success, Usecase } from "@App/core/interfaces/abstract.usecase"
import logger from "@App/core/tools/logger"
import PageOffers from "@App/domain/entities/pageResult.entity"
import {
    PageOffersIndeedDatasource,
    PageOffersIndeedDatasourceImpl,
    FindAllByQueryIndeedParams,
} from "@App/infrastructure/remote/indeed/jobOffersIndeed.datasource"
import { GetOneCityByCodeUsecase, GetOneCityByCodeUsecaseImpl } from "../cities/getOneCityByCode.usecase"

export interface GetPageOffersIndeedUsecase extends Usecase<PageOffers, Params> {
    pageOffersIndeedDatasource: PageOffersIndeedDatasource
    getOneCityByCodeUsecase: GetOneCityByCodeUsecase
    filterPageOffersUsecase: FilterPageOffersUsecase
}

export const GetPageOffersIndeedUsecaseImpl: GetPageOffersIndeedUsecase = {
    pageOffersIndeedDatasource: PageOffersIndeedDatasourceImpl,
    getOneCityByCodeUsecase: GetOneCityByCodeUsecaseImpl,
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
                const cityResult = await this.getOneCityByCodeUsecase.perform({ code: params.cityCode })
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
