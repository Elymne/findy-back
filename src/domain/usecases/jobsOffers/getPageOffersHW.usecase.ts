import { Failure, Result, Success, Usecase } from "../../../core/interfaces/abstract.usecase"
import { GetOneCityUsecase, GetOneCityUsecaseImpl } from "../cities/getOneCity.usecase"
import {
    PageOffersHWDatasource,
    PageOffersHWDatasourceImpl,
    FindAllByQueryHWParams,
} from "@App/infrastructure/remote/helloWork/datasources/jobOfferHW.datasource"
import { FilterJobOffersUsecase, FilterJobOffersUsecaseImpl } from "./filterJobOffers.usecase"
import logger from "@App/core/tools/logger"
import PageResult from "@App/domain/entities/pageResult.entity"

export interface GetPageOffersHWUsecase extends Usecase<PageResult, Params> {
    pageOffersHWDatasource: PageOffersHWDatasource
    getOneCityUsecase: GetOneCityUsecase
    filterJobOfferUsecase: FilterJobOffersUsecase
}

export const GetPageOffersHWUsecaseImpl: GetPageOffersHWUsecase = {
    pageOffersHWDatasource: PageOffersHWDatasourceImpl,
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
            } as FindAllByQueryHWParams

            if (params.cityCode) {
                const cityResult = await this.getOneCityUsecase.perform({ code: params.cityCode })
                if (cityResult instanceof Failure) return cityResult
                query.cityName = cityResult.data.name
            }

            const pageResult = await this.pageOffersHWDatasource.findAllByQuery(query)

            const jobOffersFilteredResult = await this.filterJobOfferUsecase.perform({
                sources: pageResult.jobOffers,
            })
            if (jobOffersFilteredResult instanceof Failure) return jobOffersFilteredResult

            return new Success({
                message: "Job offers from HelloWork page fetched successfully",
                data: {
                    totalPagesNb: pageResult.totalPagesNb,
                    jobOffers: jobOffersFilteredResult.data,
                },
            })
        } catch (error) {
            logger.error("[GetJobOffersHWUsecase]", error)
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
