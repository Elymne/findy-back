import { logger } from "@App/core/tools/logger"
import { Usecase, Failure, Success, Result } from "@App/core/usecase"
import { CityFTDatasource, CityFTDatasourceImpl } from "@App/infrastructure/datasources/ftapi/municipalityFT.datasource"
import { TokenFTDatasource, TokenFTDatasourceImpl } from "@App/infrastructure/datasources/ftapi/tokkenFT.datasource"
import { JobOfferParserFT, JobOfferParserFTImpl } from "@App/infrastructure/parser/jobOfferFT.parser"
import { JobOfferFTService, JobOfferFTServiceImpl } from "@App/infrastructure/services/jobOfferFT.service"
import { JobOfferFTQuery } from "@App/infrastructure/datasources/ftapi/models/jobOfferQueryFT"
import { TextFilterDatasource, TextFilterDatasourceImpl } from "@App/infrastructure/datasources/local/textFilter.datasource"
import { KnownJobOfferDatasource, KnownJobOfferDatasourceImpl } from "@App/infrastructure/datasources/local/knownJobOffer.datasource"
import { JobOfferFTDatasource, JobOfferFTDatasourceImpl } from "@App/infrastructure/datasources/ftapi/jobOfferFt.datasource"
import { JobOffer } from "@App/domain/entities/jobOffer.entity"
import { SourceSite } from "@App/domain/entities/enums/sourceData.enum"

export interface GetJobOfferFTUsecase extends Usecase<JobOffer[], GetJobOfferFTUsecaseParams> {
    tokenFTDatasource: TokenFTDatasource
    jobOfferFtDatasource: JobOfferFTDatasource
    cityFTDatasource: CityFTDatasource
    textFilterDatasource: TextFilterDatasource
    knownJobOfferDatasource: KnownJobOfferDatasource
    jobOfferFTService: JobOfferFTService
    jobOfferParserFT: JobOfferParserFT
}

export const GetJobOfferFTUsecaseImpl: GetJobOfferFTUsecase = {
    tokenFTDatasource: TokenFTDatasourceImpl,
    jobOfferFtDatasource: JobOfferFTDatasourceImpl,
    cityFTDatasource: CityFTDatasourceImpl,
    textFilterDatasource: TextFilterDatasourceImpl,
    knownJobOfferDatasource: KnownJobOfferDatasourceImpl,

    jobOfferFTService: JobOfferFTServiceImpl,

    jobOfferParserFT: JobOfferParserFTImpl,

    perform: async function (params: GetJobOfferFTUsecaseParams): Promise<Result<JobOffer[]>> {
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

            const [jobOffersFT, textFilters, jobOfferHistories] = await Promise.all([
                this.jobOfferFtDatasource.findAll(
                    {
                        commune: params.cityCode,
                        motsCles: params.keywords,
                    } as JobOfferFTQuery,
                    token
                ),
                this.textFilterDatasource.findAll(),
                this.knownJobOfferDatasource.findAllBySource(SourceSite.FTAPI),
            ])

            const { jobOfferFTFiltered, newHistories } = await this.jobOfferFTService.filter(jobOffersFT, textFilters, jobOfferHistories)

            const [jobOffers] = await Promise.all([
                this.jobOfferParserFT.parse(jobOfferFTFiltered),
                this.knownJobOfferDatasource.addMany(newHistories),
            ])

            return {
                message: "Job offers from france.travail API fetched successfully",
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

export interface GetJobOfferFTUsecaseParams {
    keywords: string
    cityCode: string
}
