import { Failure, Result, Success, Usecase } from "../../../core/interfaces/abstract.usecase"
import JobOffer from "../../entities/jobOffer.entity"
import { GetOneCityUsecase, GetOneCityUsecaseImpl } from "../cities/getOneCity.usecase"
import {
    JobOfferHWDatasource,
    JobOfferHWDatasourceImpl,
    JobOfferHWQuery,
} from "@App/infrastructure/remote/helloWork/datasources/jobOfferHW.datasource"
import { FilterJobOffersUsecase, FilterJobOffersUsecaseImpl } from "./filterJobOffers.usecase"
import logger from "@App/core/tools/logger"

export interface GetJobOffersHWUsecase extends Usecase<JobOffer[], Params> {
    jobOfferHWDatasource: JobOfferHWDatasource
    getOneCityUsecase: GetOneCityUsecase
    filterJobOfferUsecase: FilterJobOffersUsecase
}

export const GetJobOffersHWUsecaseimpl: GetJobOffersHWUsecase = {
    jobOfferHWDatasource: JobOfferHWDatasourceImpl,
    getOneCityUsecase: GetOneCityUsecaseImpl,
    filterJobOfferUsecase: FilterJobOffersUsecaseImpl,

    perform: async function (params: Params): Promise<Result<JobOffer[]>> {
        try {
            const cityResult = await this.getOneCityUsecase.perform({ code: params.cityCode })
            if (cityResult instanceof Failure) return cityResult

            const query = {
                keyWords: params.keyWords,
                radius: params.radius,
                page: params.page,
                nbElement: params.nbElements,
                cityName: cityResult.data.name,
            } as JobOfferHWQuery

            const jobOffers = await this.jobOfferHWDatasource.findAllByQuery(query)

            const jobOffersFilteredResult = await this.filterJobOfferUsecase.perform({
                sources: jobOffers,
            })
            if (jobOffersFilteredResult instanceof Failure) return jobOffersFilteredResult

            return new Success({
                message: "Job offers from HelloWork page fetched successfully",
                data: jobOffersFilteredResult.data,
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
    cityCode: string
    page?: number
    radius?: number
    nbElements?: number
}
