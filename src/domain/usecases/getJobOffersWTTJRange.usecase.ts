import { JobOfferWTTJDatasource, JobOfferWTTJDatasourceImpl } from "@App/infrastructure/datasources/wttj/jobOfferWTTJ.datasource"
import { KnownJobOfferDatasource, KnownJobOfferDatasourceImpl } from "@App/infrastructure/datasources/local/knownJobOffer.datasource"
import { TextFilterDatasource, TextFilterDatasourceImpl } from "@App/infrastructure/datasources/local/textFilter.datasource"
import { JobOfferWTTJService, JobOfferWTTJServiceImpl } from "@App/infrastructure/services/jobOfferWTTJ.service"
import { JobOfferWTTJParser, JobOfferWTTJParserImpl } from "@App/infrastructure/parser/jobOfferWTTJ.parser"
import { SourceSite } from "../entities/enums/sourceData.enum"
import { JobOffer } from "../entities/jobOffer.entity"
import { Failure, Result, Success, Usecase } from "./abstract.usecase"
import { logger } from "@App/core/logger"

export interface GetJobOffersWTTJRangeUsecase extends Usecase<JobOffer[], Params> {
    jobOfferWTTJDatasource: JobOfferWTTJDatasource
    knownJobOfferDatasource: KnownJobOfferDatasource
    textFilterDatasource: TextFilterDatasource
    jobOfferWTTJService: JobOfferWTTJService
    jobOfferWTTJParser: JobOfferWTTJParser
}

export const GetJobOffersWTTJRangeUsecaseImpl: GetJobOffersWTTJRangeUsecase = {
    jobOfferWTTJDatasource: JobOfferWTTJDatasourceImpl,
    knownJobOfferDatasource: KnownJobOfferDatasourceImpl,
    textFilterDatasource: TextFilterDatasourceImpl,
    jobOfferWTTJService: JobOfferWTTJServiceImpl,
    jobOfferWTTJParser: JobOfferWTTJParserImpl,

    perform: async function (params: Params): Promise<Result<JobOffer[]>> {
        try {
            const [jobOffersRawData, textFiltersData, knownJobOffersData] = await Promise.all([
                this.jobOfferWTTJDatasource.findRangeByQuery({
                    keyWords: params.keyWords,
                    page: params.page,
                    nb: params.nb,
                }),
                this.textFilterDatasource.findAll(),
                this.knownJobOfferDatasource.findAllBySource(SourceSite.WTTJ),
            ])

            const { sourceFiltered: jobOffersRawDataFiltered, newKnownJobOffers } = await this.jobOfferWTTJService.filter(
                jobOffersRawData,
                textFiltersData,
                knownJobOffersData
            )

            const [jobOffersData] = await Promise.all([
                this.jobOfferWTTJParser.parse(jobOffersRawDataFiltered),
                this.knownJobOfferDatasource.addMany(newKnownJobOffers),
            ])

            return new Success({
                message: `Job offers from WelcomeToTheJungle page fetched successfully`,
                data: jobOffersData,
            })
        } catch (error) {
            logger.error("[GetJobOffersWTTJRangeUsecase]", error)
            return new Failure({
                message: "An internal error occur",
                errorCode: 500,
            })
        }
    },
}

interface Params {
    keyWords: string
    page: number
    nb: number
}
