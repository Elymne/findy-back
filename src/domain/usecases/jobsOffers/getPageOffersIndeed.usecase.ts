import {
    PageOffersIndeedDatasource,
    PageOffersIndeedDatasourceImpl,
    FindAllByQueryIndeedParams,
} from "@App/infrastructure/remote/indeed/datasources/jobOffersIndeed.datasource"
import { GetOneCityUsecase, GetOneCityUsecaseImpl } from "../cities/getOneCity.usecase"
import { FilterJobOffersUsecase, FilterJobOffersUsecaseImpl } from "./filterJobOffers.usecase"
import { Failure, Result, Success, Usecase } from "@App/core/interfaces/abstract.usecase"
import logger from "@App/core/tools/logger"
import PageResult from "@App/domain/entities/pageResult.entity"

export interface GetPageOffersIndeedUsecase extends Usecase<PageResult, Params> {
    pageOffersIndeedDatasource: PageOffersIndeedDatasource
    getOneCityUsecase: GetOneCityUsecase
    filterJobOfferUsecase: FilterJobOffersUsecase
}

export const GetPageOffersIndeedUsecaseImpl: GetPageOffersIndeedUsecase = {
    pageOffersIndeedDatasource: PageOffersIndeedDatasourceImpl,
    getOneCityUsecase: GetOneCityUsecaseImpl,
    filterJobOfferUsecase: FilterJobOffersUsecaseImpl,

    perform: async function (params: Params): Promise<Result<PageResult>> {
        try {
            const query = {
                keyWords: params.keyWords,
                radius: params.radius,
                page: params.page,
                nbElement: params.nbElements,
                cityName: undefined,
            } as FindAllByQueryIndeedParams

            if (params.cityCode) {
                const cityResult = await this.getOneCityUsecase.perform({ code: params.cityCode })
                if (cityResult instanceof Failure) return cityResult
                query.cityName = cityResult.data.name
            }

            const pageResult = await this.pageOffersIndeedDatasource.findAllByQuery(query)

            const jobOffersFilteredResult = await this.filterJobOfferUsecase.perform({
                sources: pageResult.jobOffers,
            })

            if (jobOffersFilteredResult instanceof Failure) return jobOffersFilteredResult

            return new Success({
                message: "Job offers from Indeed page fetched successfully",
                data: {
                    totalPagesNb: pageResult.totalPagesNb,
                    jobOffers: jobOffersFilteredResult.data,
                },
            })
        } catch (error) {
            logger.error("[GetJobOffersIndeedUsecase]", error)
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
