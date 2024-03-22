import { JobOfferHWDatasource, JobOfferHWDatasourceImpl } from "@App/infrastructure/hw/datasources/jobOfferHW.datasource"
import { JobOffer } from "../entities/jobOffer.entity"
import { Result, Usecase } from "./abstract.usecase"

export interface GetJobOffersHWUsecase extends Usecase<JobOffer[], _Params> {
    jobOfferHWDatasource: JobOfferHWDatasource
}

export const GetJobOffersHWUsecaseimpl: GetJobOffersHWUsecase = {
    jobOfferHWDatasource: JobOfferHWDatasourceImpl,

    perform: function (params: _Params): Promise<Result<JobOffer[]>> {
        throw new Error("Function not implemented.")
    },
}

type _Params = {}
