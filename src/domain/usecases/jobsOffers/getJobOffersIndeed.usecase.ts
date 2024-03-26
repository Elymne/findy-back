import {
    JobOfferIndeedDatasource,
    JobOfferIndeedDatasourceImpl,
    JobOfferIndeedQuery,
} from "@App/infrastructure/remote/indeed/datasources/jobOffersIndeed.datasource"
import { GetOneCityUsecase, GetOneCityUsecaseImpl } from "../cities/getOneCity.usecase"
import { FilterJobOffersUsecase, FilterJobOffersUsecaseImpl } from "./filterJobOffers.usecase"
import { Failure, Result, Success, Usecase } from "@App/core/interfaces/abstract.usecase"
import logger from "@App/core/tools/logger"
import JobOffer from "@App/domain/entities/jobOffer.entity"

export interface GetJobOffersIndeedUsecase extends Usecase<JobOffer[], Params> {
    jobOfferIndeedDatasource: JobOfferIndeedDatasource
    getOneCityUsecase: GetOneCityUsecase
    filterJobOfferUsecase: FilterJobOffersUsecase
}

export const GetJobOffersIndeedUsecaseimpl: GetJobOffersIndeedUsecase = {
    jobOfferIndeedDatasource: JobOfferIndeedDatasourceImpl,
    getOneCityUsecase: GetOneCityUsecaseImpl,
    filterJobOfferUsecase: FilterJobOffersUsecaseImpl,

    perform: async function (params: Params): Promise<Result<JobOffer[]>> {
        try {
            const query = {
                keyWords: params.keyWords,
                radius: params.radius,
                page: params.page,
                nbElement: params.nbElements,
                cityName: undefined,
            } as JobOfferIndeedQuery

            if (params.cityCode) {
                const cityResult = await this.getOneCityUsecase.perform({ code: params.cityCode })
                if (cityResult instanceof Failure) return cityResult
                query.cityName = cityResult.data.name
            }

            const jobOffers = await this.jobOfferIndeedDatasource.findAllByQuery(query)

            const jobOffersFilteredResult = await this.filterJobOfferUsecase.perform({
                sources: jobOffers,
            })
            if (jobOffersFilteredResult instanceof Failure) return jobOffersFilteredResult

            return new Success({
                message: "Job offers from Indeed page fetched successfully",
                data: jobOffersFilteredResult.data,
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
