import { Result, Usecase } from "./abstract.usecase"
import JobOffer from "../entities/jobOffer.entity"
import { GetOneCityUsecase, GetOneCityUsecaseImpl } from "./getOneCity.usecase"
import { JobOfferHWDatasource, JobOfferHWDatasourceImpl } from "@App/infrastructure/remote/helloWork/datasources/jobOfferHW.datasource"
import { FilterJobOffersUsecase, FilterJobOffersUsecaseImpl } from "./filterJobOffers.usecase"

type Params = {
    keyWords: string
    cityCode?: string
    page?: number
    radius?: number
    nbElements?: number
}

export interface GetJobOffersHWUsecase extends Usecase<JobOffer[], Params> {
    jobOfferHWDatasource: JobOfferHWDatasource
    getOneCityUsecase: GetOneCityUsecase
    filterJobOfferUsecase: FilterJobOffersUsecase
}

export const GetJobOffersHWUsecaseimpl: GetJobOffersHWUsecase = {
    jobOfferHWDatasource: JobOfferHWDatasourceImpl,
    getOneCityUsecase: GetOneCityUsecaseImpl,
    filterJobOfferUsecase: FilterJobOffersUsecaseImpl,

    perform: function (params: Params): Promise<Result<JobOffer[]>> {
        console.log(params)
        throw new Error("Function not implemented.")
    },
}
