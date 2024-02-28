import { logger } from "~/core/tools/logger"
import { Failure, Result, Success, Usecase } from "~/core/usecase"
import { JobOfferSource } from "~/domain/entities/databases/jobOfferHistory"
import { JobOffer } from "~/domain/entities/jobOffer.entity"
import { JobOfferHistoryDatasource, JobOfferHistoryDatasourceImpl } from "~/infrastructure/datasources/local/jobOfferHistory.datasource"
import { TextFilterDatasource, TextFilterDatasourceImpl } from "~/infrastructure/datasources/local/textFilter.datasource"
import { JobOfferWTTJDatasource, JobOfferWTTJDatasourceImpl } from "~/infrastructure/datasources/wttj/jobOfferWTTJ.datasource"
import { JobOfferWTTJParser, JobOfferWTTJParserImpl } from "~/infrastructure/parser/jobOfferWTTJ.parser"
import { JobOfferWTTJService, JobOfferWTTJServiceImpl } from "~/infrastructure/services/jobOfferWTTJ.service"

export interface GetJobOffersWTTJUsecase extends Usecase<JobOffer[], GetJobOffersWTTJUsecaseParams> {
    jobOfferWTTJDatasource: JobOfferWTTJDatasource
    jobOfferWTTJService: JobOfferWTTJService
    textFilterDatasource: TextFilterDatasource
    jobOfferHistoryDatasource: JobOfferHistoryDatasource
    jobOfferWTTJParser: JobOfferWTTJParser
}

export const GetJobOffersWTTJUsecaseimpl: GetJobOffersWTTJUsecase = {
    jobOfferWTTJDatasource: JobOfferWTTJDatasourceImpl,
    jobOfferWTTJService: JobOfferWTTJServiceImpl,
    textFilterDatasource: TextFilterDatasourceImpl,
    jobOfferHistoryDatasource: JobOfferHistoryDatasourceImpl,
    jobOfferWTTJParser: JobOfferWTTJParserImpl,

    perform: async function (params: GetJobOffersWTTJUsecaseParams): Promise<Result<JobOffer[]>> {
        try {
            const [jobOffersWTTJ, textFilters, jobOfferHistories] = await Promise.all([
                this.jobOfferWTTJDatasource.findAll(params.keyWords, params.city),
                this.textFilterDatasource.findAll(),
                this.jobOfferHistoryDatasource.findAllBySource(JobOfferSource.wttj),
            ])

            const { jobOffersWTTJFiltered, newHistories } = await this.jobOfferWTTJService.filter(
                jobOffersWTTJ,
                textFilters,
                jobOfferHistories
            )

            const [jobOffers, _] = await Promise.all([
                this.jobOfferWTTJParser.parse(jobOffersWTTJFiltered),
                this.jobOfferHistoryDatasource.addMany(newHistories),
            ])

            return {
                message: "Job offers from WelcomeToTheJungle page fetched successfully",
                data: jobOffers,
            } as Success<JobOffer[]>
        } catch (error) {
            logger.error(error)
            return {
                message: "An internal error occur",
                data: [],
                errorCode: 500,
            } as Failure<JobOffer[]>
        }
    },
}

export interface GetJobOffersWTTJUsecaseParams {
    keyWords: string
    city: string
}
