import { Failure, Result, Success, Usecase } from "@App/core/usecase"
import { JobOffersUsecaseParams } from "./jobOfferUsecaseParams"
import { JobOffer } from "@App/domain/entities/jobOffer.entity"
import { JobOfferParserFT, JobOfferParserFTImpl } from "@App/infrastructure/parser/jobOfferFT.parser"
import { JobOfferFTDatasource, JobOfferFTDatasourceImpl } from "@App/infrastructure/datasources/ftapi/jobOfferFt.datasource"
import { CityFTDatasource, CityFTDatasourceImpl } from "@App/infrastructure/datasources/ftapi/municipalityFT.datasource"
import { TokenFTDatasource, TokenFTDatasourceImpl } from "@App/infrastructure/datasources/ftapi/tokkenFT.datasource"
import { GeoapiDatasource, GeoapiDatasourceImpl } from "@App/infrastructure/datasources/geoapi/geoapiDatasource"
import { KnownJobOfferDatasource, KnownJobOfferDatasourceImpl } from "@App/infrastructure/datasources/local/knownJobOffer.datasource"
import { TextFilterDatasource, TextFilterDatasourceImpl } from "@App/infrastructure/datasources/local/textFilter.datasource"
import { JobOfferWTTJDatasource, JobOfferWTTJDatasourceImpl } from "@App/infrastructure/datasources/wttj/jobOfferWTTJ.datasource"
import { JobOfferWTTJParser, JobOfferWTTJParserImpl } from "@App/infrastructure/parser/jobOfferWTTJ.parser"
import { JobOfferFTService, JobOfferFTServiceImpl } from "@App/infrastructure/services/jobOfferFT.service"
import { JobOfferWTTJService, JobOfferWTTJServiceImpl } from "@App/infrastructure/services/jobOfferWTTJ.service"
import { logger } from "@App/core/tools/logger"
import { SourceSite } from "@App/domain/entities/enums/sourceData.enum"
import { ContractType } from "@App/domain/entities/enums/contractType.enum"

export interface GetJobOffersUsecase extends Usecase<JobOffer[], JobOffersUsecaseParams> {
    // Datasources dependancies
    tokenFTDatasource: TokenFTDatasource
    jobOfferFtDatasource: JobOfferFTDatasource
    jobOfferWTTJDatasource: JobOfferWTTJDatasource
    knownJobOfferDatasource: KnownJobOfferDatasource
    geoapiDatasource: GeoapiDatasource
    cityFTDatasource: CityFTDatasource
    textFilterDatasource: TextFilterDatasource

    // Services depedencies
    jobOfferWTTJService: JobOfferWTTJService
    jobOfferFTService: JobOfferFTService

    // Parsers depedencies
    jobOfferParserFT: JobOfferParserFT
    jobOfferWTTJParser: JobOfferWTTJParser
}

export const GetJobOffersUsecaseImpl: GetJobOffersUsecase = {
    tokenFTDatasource: TokenFTDatasourceImpl,
    jobOfferFtDatasource: JobOfferFTDatasourceImpl,
    jobOfferWTTJDatasource: JobOfferWTTJDatasourceImpl,
    knownJobOfferDatasource: KnownJobOfferDatasourceImpl,
    geoapiDatasource: GeoapiDatasourceImpl,
    cityFTDatasource: CityFTDatasourceImpl,
    textFilterDatasource: TextFilterDatasourceImpl,
    jobOfferWTTJService: JobOfferWTTJServiceImpl,
    jobOfferFTService: JobOfferFTServiceImpl,
    jobOfferParserFT: JobOfferParserFTImpl,
    jobOfferWTTJParser: JobOfferWTTJParserImpl,

    perform: async function (params: JobOffersUsecaseParams): Promise<Result<JobOffer[]>> {
        try {
            // Generate the token for france.travail API.
            const token = await this.tokenFTDatasource.generate()

            // Get the city from fance.travail API and check if the code exists. Send Error if not.
            const city = await this.cityFTDatasource.findOne(params.cityCode, token)
            if (!city) {
                return {
                    message: `The city code given (${params.cityCode}) does not exists in france.travail API references data.`,
                    data: [],
                    errorCode: 404,
                } as Failure<JobOffer[]>
            }

            // Get useful data for our services.
            const [geoCity, textFilters, knownJobOffersFTAPI, knownJobOffersWTTJ] = await Promise.all([
                this.geoapiDatasource.findOne(params.cityCode),
                this.textFilterDatasource.findAll(),
                this.knownJobOfferDatasource.findAllBySource(SourceSite.FTAPI),
                this.knownJobOfferDatasource.findAllBySource(SourceSite.WTTJ),
            ])

            // Fetch data from france.travail API and WTTJ web page.
            const [jobOffersFT, jobOffersWTTJ] = await Promise.all([
                this.jobOfferFtDatasource.findAll(
                    {
                        typeContrat: ContractType.CDD,
                        motsCles: params.keyWords,
                        commune: params.cityCode,
                        range: `${(params.page - 1) * 30 + 1}-${params.page * 30 + 1}`,
                    },
                    token
                ),
                this.jobOfferWTTJDatasource.findAllByQuery(
                    params.keyWords,
                    geoCity.centre.coordinates[1],
                    geoCity.centre.coordinates[0],
                    params.page
                ),
            ])

            // Filter our data.
            const [
                { jobOfferFTFiltered, newKnownJobOffers: newKnownJobOffersFT },
                { jobOffersWTTJFiltered, newKnownJobOffers: newKnownJobOffersWTTJ },
            ] = await Promise.all([
                this.jobOfferFTService.filter(jobOffersFT, textFilters, knownJobOffersFTAPI),
                this.jobOfferWTTJService.filter(jobOffersWTTJ, textFilters, knownJobOffersWTTJ),
            ])

            // Parse our data.
            const [A, B] = await Promise.all([
                this.jobOfferWTTJParser.parse(jobOffersWTTJFiltered),
                this.jobOfferParserFT.parse(jobOfferFTFiltered),
                this.knownJobOfferDatasource.addMany(newKnownJobOffersFT),
                this.knownJobOfferDatasource.addMany(newKnownJobOffersWTTJ),
            ])

            const jobOffers = [...A, ...B]

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
