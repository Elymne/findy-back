import { Usecase } from "~/core/usecase"
import { JobOffer } from "~/domain/entities/jobOffer.entity"
import { JobOfferWTTJDatasource } from "~/infrastructure/datasources/wttj/jobOfferWTTJ.datasource"

export interface GetJobOffersWTTJUsecase extends Usecase<JobOffer[], GetJobOffersWTTJUsecase> {
    jobOfferWTTJDatasource: JobOfferWTTJDatasource
}

export interface GetJobOffersWTTJUsecase {
    keyWords: string
    city: string
}
