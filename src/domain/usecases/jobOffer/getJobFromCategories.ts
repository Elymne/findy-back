import { logger } from "@App/core/tools/logger"
import { Failure, Result, Success, UsecaseNoParams } from "@App/core/usecase"
import { ContractType } from "@App/domain/entities/enums/contractType.enum"
import { SourceSite } from "@App/domain/entities/enums/sourceData.enum"
import { JobOffer } from "@App/domain/entities/jobOffer.entity"
import { JobOfferFTDatasource, JobOfferFTDatasourceImpl } from "@App/infrastructure/datasources/ftapi/jobOfferFt.datasource"
import { CityFTDatasource, CityFTDatasourceImpl } from "@App/infrastructure/datasources/ftapi/municipalityFT.datasource"
import { TokenFTDatasource, TokenFTDatasourceImpl } from "@App/infrastructure/datasources/ftapi/tokkenFT.datasource"
import { KnownJobOfferDatasource, KnownJobOfferDatasourceImpl } from "@App/infrastructure/datasources/local/knownJobOffer.datasource"
import { TextFilterDatasource, TextFilterDatasourceImpl } from "@App/infrastructure/datasources/local/textFilter.datasource"
import { JobOfferParserFT, JobOfferParserFTImpl } from "@App/infrastructure/parser/jobOfferFT.parser"
import { JobOfferFTService, JobOfferFTServiceImpl } from "@App/infrastructure/services/jobOfferFT.service"

export interface GetJobFromCategories extends UsecaseNoParams<JobsCategories> {
    tokenFTDatasource: TokenFTDatasource
    jobOfferFtDatasource: JobOfferFTDatasource
    textFilterDatasource: TextFilterDatasource
    knownJobOfferDatasource: KnownJobOfferDatasource
    jobOfferFTService: JobOfferFTService
    jobOfferParserFT: JobOfferParserFT
}

export interface JobsCategories {
    marketing: JobOffer[]
    communication: JobOffer[]
    compatibility: JobOffer[]
    webdev: JobOffer[]
    humainResources: JobOffer[]
    commercial: JobOffer[]
}

export const GetJobFromCategoriesimpl: GetJobFromCategories = {
    tokenFTDatasource: TokenFTDatasourceImpl,
    jobOfferFtDatasource: JobOfferFTDatasourceImpl,
    textFilterDatasource: TextFilterDatasourceImpl,
    knownJobOfferDatasource: KnownJobOfferDatasourceImpl,
    jobOfferFTService: JobOfferFTServiceImpl,
    jobOfferParserFT: JobOfferParserFTImpl,

    perform: async function (): Promise<Result<JobsCategories>> {
        try {
            const token = await this.tokenFTDatasource.generate()

            const [textFilters, jobOfferHistories] = await Promise.all([
                this.textFilterDatasource.findAll(),
                this.knownJobOfferDatasource.findAllBySource(SourceSite.FTAPI),
            ])

            const [
                marketingJobOffers,
                communicationJobOffers,
                comptabilityJobOffers,
                webDevJobOffers,
                humanResourcesJobOffers,
                commercialJobOffers,
            ] = await Promise.all([
                this.jobOfferFtDatasource.findAll(
                    {
                        typeContrat: ContractType.CDD,
                        motsCles: "Marketing",
                    },
                    token
                ),
                this.jobOfferFtDatasource.findAll(
                    {
                        typeContrat: ContractType.CDD,
                        motsCles: "Communication",
                    },
                    token
                ),
                this.jobOfferFtDatasource.findAll(
                    {
                        typeContrat: ContractType.CDD,
                        motsCles: "Comptabilité",
                    },
                    token
                ),
                this.jobOfferFtDatasource.findAll(
                    {
                        typeContrat: ContractType.CDD,
                        motsCles: "Développement Web",
                    },
                    token
                ),
                this.jobOfferFtDatasource.findAll(
                    {
                        typeContrat: ContractType.CDD,
                        motsCles: "RH",
                    },
                    token
                ),
                this.jobOfferFtDatasource.findAll(
                    {
                        typeContrat: ContractType.CDD,
                        motsCles: "Commercial",
                    },
                    token
                ),
            ])

            return {
                message: "Job offers from france.travail API fetched successfully",
                data: {} as JobsCategories,
            } as Success<JobsCategories>
        } catch (error) {
            logger.error(error)
            return {
                message: "An internal error occur",
                data: {} as JobsCategories,
                errorCode: 500,
            } as Failure<JobsCategories>
        }
    },
}
