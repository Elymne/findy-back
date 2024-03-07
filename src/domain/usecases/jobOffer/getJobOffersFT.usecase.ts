import { logger } from "@App/core/tools/logger"
import { Usecase, Failure, Success, Result } from "@App/core/usecase"
import { CityFTDatasource, CityFTDatasourceImpl } from "@App/infrastructure/datasources/ftapi/municipalityFT.datasource"
import { TokenFTDatasource, TokenFTDatasourceImpl } from "@App/infrastructure/datasources/ftapi/tokkenFT.datasource"
import { JobOfferParserFT, JobOfferParserFTImpl } from "@App/infrastructure/parser/jobOfferFT.parser"
import { JobOfferFTService, JobOfferFTServiceImpl } from "@App/infrastructure/services/jobOfferFT.service"
import { TextFilterDatasource, TextFilterDatasourceImpl } from "@App/infrastructure/datasources/local/textFilter.datasource"
import { KnownJobOfferDatasource, KnownJobOfferDatasourceImpl } from "@App/infrastructure/datasources/local/knownJobOffer.datasource"
import { JobOfferFTDatasource, JobOfferFTDatasourceImpl } from "@App/infrastructure/datasources/ftapi/jobOfferFt.datasource"
import { JobOffer } from "@App/domain/entities/jobOffer.entity"
import { SourceSite } from "@App/domain/entities/enums/sourceData.enum"
import { JobOffersUsecaseParams } from "./jobOfferUsecaseParams"
import { ContractType } from "@App/domain/entities/enums/contractType.enum"

export interface GetJobOfferFTUsecase extends Usecase<JobOffer[], JobOffersUsecaseParams> {
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

    perform: async function (params: JobOffersUsecaseParams): Promise<Result<JobOffer[]>> {
        try {
            const token = await this.tokenFTDatasource.generate()

            const city = await this.cityFTDatasource.findOne(params.cityCode, token)
            if (!city) {
                return {
                    message: "The city code given does not exists in france.travail API references data.",
                    data: [],
                    errorCode: 404,
                } as Failure<JobOffer[]>
            }

            const [jobOffersFT, textFilters, jobOfferHistories] = await Promise.all([
                this.jobOfferFtDatasource.findAll(
                    {
                        typeContrat: ContractType.CDD,
                        motsCles: params.keyWords,
                        commune: params.cityCode,
                        range: `${(params.page - 1) * 30 + 1}-${params.page * 30 + 1}`,
                    },
                    token
                ),
                this.textFilterDatasource.findAll(),
                this.knownJobOfferDatasource.findAllBySource(SourceSite.FTAPI),
            ])

            const { jobOfferFTFiltered, newKnownJobOffers } = await this.jobOfferFTService.filter(
                jobOffersFT,
                textFilters,
                jobOfferHistories
            )

            const [jobOffers] = await Promise.all([
                this.jobOfferParserFT.parse(jobOfferFTFiltered),
                this.knownJobOfferDatasource.addMany(newKnownJobOffers),
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
