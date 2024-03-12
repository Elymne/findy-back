import { JobOfferWTTJDatasource, JobOfferWTTJDatasourceImpl } from "@App/infrastructure/datasources/wttj/jobOfferWTTJ.datasource"
import { DoesCityExistsUsecase, DoesCityExistsUsecaseImpl } from "./doesCityExists"
import { GeoapiDatasource, GeoapiDatasourceImpl } from "@App/infrastructure/datasources/geoapi/geoapiDatasource"
import { KnownJobOfferDatasource, KnownJobOfferDatasourceImpl } from "@App/infrastructure/datasources/local/knownJobOffer.datasource"
import { TextFilterDatasource, TextFilterDatasourceImpl } from "@App/infrastructure/datasources/local/textFilter.datasource"
import { JobOfferWTTJService, JobOfferWTTJServiceImpl } from "@App/infrastructure/services/jobOfferWTTJ.service"
import { JobOfferWTTJParser, JobOfferWTTJParserImpl } from "@App/infrastructure/parser/jobOfferWTTJ.parser"
import { Failure, Result, Success, Usecase } from "@App/core/usecase"
import { JobOffer } from "../entities/jobOffer.entity"
import { SourceSite } from "../entities/enums/sourceData.enum"
import { logger } from "@App/core/tools/logger"

export interface GetJobOffersWTTJUsecase extends Usecase<JobOffer[], Params> {
    doesCityExistsUsecase: DoesCityExistsUsecase
    jobOfferWTTJDatasource: JobOfferWTTJDatasource
    geoapiDatasource: GeoapiDatasource
    knownJobOfferDatasource: KnownJobOfferDatasource
    textFilterDatasource: TextFilterDatasource
    jobOfferWTTJService: JobOfferWTTJService
    jobOfferWTTJParser: JobOfferWTTJParser
}

export const GetJobOffersWTTJUsecaseImpl: GetJobOffersWTTJUsecase = {
    doesCityExistsUsecase: DoesCityExistsUsecaseImpl,
    jobOfferWTTJDatasource: JobOfferWTTJDatasourceImpl,
    geoapiDatasource: GeoapiDatasourceImpl,
    knownJobOfferDatasource: KnownJobOfferDatasourceImpl,
    textFilterDatasource: TextFilterDatasourceImpl,
    jobOfferWTTJService: JobOfferWTTJServiceImpl,
    jobOfferWTTJParser: JobOfferWTTJParserImpl,

    perform: async function (params: Params): Promise<Result<JobOffer[]>> {
        try {
            const doesCityExistsResult = await this.doesCityExistsUsecase.perform({ code: params.cityCode })
            if (doesCityExistsResult instanceof Failure) return doesCityExistsResult

            if (!doesCityExistsResult.data) {
                return new Failure({
                    message: doesCityExistsResult.message,
                    errorCode: 404,
                })
            }

            const [geoCityData, textFiltersData, knownJobOffersData] = await Promise.all([
                this.geoapiDatasource.findOne(params.cityCode),
                this.textFilterDatasource.findAll(),
                this.knownJobOfferDatasource.findAllBySource(SourceSite.WTTJ),
            ])

            const jobOffersRawData = await this.jobOfferWTTJDatasource.findAllByQuery(
                params.keyWords,
                geoCityData.centre.coordinates[1],
                geoCityData.centre.coordinates[0],
                params.page
            )

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
                message: "Job offers from WelcomeToTheJungle page fetched successfully",
                data: jobOffersData,
            })
        } catch (error) {
            logger.error("[GetJobOffersWTTJUsecase]", error)
            return new Failure({
                message: "An internal error occur",
                errorCode: 500,
            })
        }
    },
}

interface Params {
    keyWords: string
    cityCode: string
    page: number
}
