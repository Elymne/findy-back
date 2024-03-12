import { logger } from "@App/core/tools/logger"
import { Usecase, Failure, Success, Result } from "@App/core/usecase"
import { JobOfferParserFT, JobOfferParserFTImpl } from "@App/infrastructure/parser/jobOfferFT.parser"
import { JobOfferFTService, JobOfferFTServiceImpl } from "@App/infrastructure/services/jobOfferFT.service"
import { TextFilterDatasource, TextFilterDatasourceImpl } from "@App/infrastructure/datasources/local/textFilter.datasource"
import { KnownJobOfferDatasource, KnownJobOfferDatasourceImpl } from "@App/infrastructure/datasources/local/knownJobOffer.datasource"
import { JobOfferFTDatasource, JobOfferFTDatasourceImpl } from "@App/infrastructure/datasources/ftapi/jobOfferFt.datasource"
import { JobOffer } from "@App/domain/entities/jobOffer.entity"
import { SourceSite } from "@App/domain/entities/enums/sourceData.enum"
import { ContractType } from "@App/domain/entities/enums/contractType.enum"
import { GetTokenFTUsecase, GetTokenFTUsecaseImpl } from "./getFTToken.usecase"
import { DoesCityExistsUsecase, DoesCityExistsUsecaseImpl } from "./doesCityExists"

export interface GetJobOfferFTUsecase extends Usecase<JobOffer[], Params> {
    getTokenFTUsecase: GetTokenFTUsecase
    doesCityExistsUsecase: DoesCityExistsUsecase
    jobOfferFtDatasource: JobOfferFTDatasource
    textFilterDatasource: TextFilterDatasource
    knownJobOfferDatasource: KnownJobOfferDatasource
    jobOfferFTService: JobOfferFTService
    jobOfferParserFT: JobOfferParserFT
}

export const GetJobOfferFTUsecaseImpl: GetJobOfferFTUsecase = {
    getTokenFTUsecase: GetTokenFTUsecaseImpl,
    doesCityExistsUsecase: DoesCityExistsUsecaseImpl,
    jobOfferFtDatasource: JobOfferFTDatasourceImpl,
    textFilterDatasource: TextFilterDatasourceImpl,
    knownJobOfferDatasource: KnownJobOfferDatasourceImpl,
    jobOfferFTService: JobOfferFTServiceImpl,
    jobOfferParserFT: JobOfferParserFTImpl,

    perform: async function (params: Params): Promise<Result<JobOffer[]>> {
        try {
            if (params.cityCode) {
                const doesCityExistsResult = await this.doesCityExistsUsecase.perform({ code: params.cityCode })
                if (doesCityExistsResult instanceof Failure) {
                    return doesCityExistsResult
                }
                if (!doesCityExistsResult.data) {
                    return new Failure({
                        message: doesCityExistsResult.message,
                        errorCode: 404,
                    })
                }
            }

            const tokenResult = await this.getTokenFTUsecase.perform()
            if (tokenResult instanceof Failure) {
                return tokenResult
            }

            const [jobOffersRawData, textFiltersData, knownJobOffersData] = await Promise.all([
                this.jobOfferFtDatasource.findAll(
                    {
                        typeContrat: ContractType.CDD,
                        motsCles: `Alternance ${params.keyWords}`,
                        commune: params.cityCode,
                        range: `${(params.page! - 1) * 30 + 1}-${params.page! * 30 + 1}`,
                    },
                    tokenResult.data!
                ),
                this.textFilterDatasource.findAll(),
                this.knownJobOfferDatasource.findAllBySource(SourceSite.FTAPI),
            ])

            const { sourceFiltered: jobOffersRawDataFiltered, newKnownJobOffers } = await this.jobOfferFTService.filter(
                jobOffersRawData,
                textFiltersData,
                knownJobOffersData
            )

            const [jobOffersData] = await Promise.all([
                this.jobOfferParserFT.parse(jobOffersRawDataFiltered),
                this.knownJobOfferDatasource.addMany(newKnownJobOffers),
            ])

            return new Success({
                message: "Job offers from france.travail API fetched successfully",
                data: jobOffersData,
            })
        } catch (error) {
            logger.error("[GetJobOfferFTUsecaseImpl]", error)
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

    cityCode?: string
}
