import { logger } from "@App/core/tools/logger"
import { Failure, Result, Success, Usecase } from "@App/core/usecase"
import { SourceSite } from "@App/domain/entities/enums/sourceData.enum"
import { JobOffer } from "@App/domain/entities/jobOffer.entity"
import { CityFTDatasource, CityFTDatasourceImpl } from "@App/infrastructure/datasources/ftapi/municipalityFT.datasource"
import { TokenFTDatasource, TokenFTDatasourceImpl } from "@App/infrastructure/datasources/ftapi/tokkenFT.datasource"
import { GeoapiDatasource, GeoapiDatasourceImpl } from "@App/infrastructure/datasources/geoapi/geoapiDatasource"
import { KnownJobOfferDatasource, KnownJobOfferDatasourceImpl } from "@App/infrastructure/datasources/local/knownJobOffer.datasource"
import { TextFilterDatasource, TextFilterDatasourceImpl } from "@App/infrastructure/datasources/local/textFilter.datasource"
import { JobOfferWTTJDatasource, JobOfferWTTJDatasourceImpl } from "@App/infrastructure/datasources/wttj/jobOfferWTTJ.datasource"
import { JobOfferWTTJParser, JobOfferWTTJParserImpl } from "@App/infrastructure/parser/jobOfferWTTJ.parser"
import { JobOfferWTTJService, JobOfferWTTJServiceImpl } from "@App/infrastructure/services/jobOfferWTTJ.service"
import { JobOffersUsecaseParams } from "./jobOfferUsecaseParams"

export interface GetJobOffersWTTJUsecase extends Usecase<JobOffer[], JobOffersUsecaseParams> {
    jobOfferWTTJDatasource: JobOfferWTTJDatasource
    knownJobOfferDatasource: KnownJobOfferDatasource
    textFilterDatasource: TextFilterDatasource
    geoapiDatasource: GeoapiDatasource
    tokenFTDatasource: TokenFTDatasource
    cityFTDatasource: CityFTDatasource
    jobOfferWTTJService: JobOfferWTTJService
    jobOfferWTTJParser: JobOfferWTTJParser
}

export const GetJobOffersWTTJUsecaseimpl: GetJobOffersWTTJUsecase = {
    jobOfferWTTJDatasource: JobOfferWTTJDatasourceImpl,
    knownJobOfferDatasource: KnownJobOfferDatasourceImpl,
    textFilterDatasource: TextFilterDatasourceImpl,
    geoapiDatasource: GeoapiDatasourceImpl,
    tokenFTDatasource: TokenFTDatasourceImpl,
    cityFTDatasource: CityFTDatasourceImpl,
    jobOfferWTTJService: JobOfferWTTJServiceImpl,
    jobOfferWTTJParser: JobOfferWTTJParserImpl,

    perform: async function (params: JobOffersUsecaseParams): Promise<Result<JobOffer[]>> {
        try {
            const token = await this.tokenFTDatasource.generate()

            const city = await this.cityFTDatasource.findOne(params.cityCode, token)
            if (!city) {
                return {
                    message: "The municipality code given does not exists in france.travail API references data.",
                    data: [],
                    errorCode: 404,
                } as Failure<JobOffer[]>
            }

            const [geoCity, textFilters, knownJobOffers] = await Promise.all([
                this.geoapiDatasource.findOne(params.cityCode),
                this.textFilterDatasource.findAll(),
                this.knownJobOfferDatasource.findAllBySource(SourceSite.WTTJ),
            ])

            const jobOffersWTTJ = await this.jobOfferWTTJDatasource.findAllByQuery(
                params.keyWords,
                geoCity.centre.coordinates[1],
                geoCity.centre.coordinates[0],
                params.page
            )

            const { jobOffersWTTJFiltered, newKnownJobOffers } = await this.jobOfferWTTJService.filter(
                jobOffersWTTJ,
                textFilters,
                knownJobOffers
            )

            const [jobOffers] = await Promise.all([
                this.jobOfferWTTJParser.parse(jobOffersWTTJFiltered),
                this.knownJobOfferDatasource.addMany(newKnownJobOffers),
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
