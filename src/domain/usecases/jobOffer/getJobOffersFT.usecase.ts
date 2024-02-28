import { logger } from "~/core/tools/logger"
import { Usecase, Failure, Success, Result } from "~/core/usecase"
import { JobOfferFTDatasource, JobOfferFTDatasourceImpl } from "~/infrastructure/datasources/ftapi/jobOfferFT.datasource"
import { MunicipalityFTDatasource, MunicipalityFTDatasourceImpl } from "~/infrastructure/datasources/ftapi/municipalityFT.datasource"
import { TokenFTDatasource, TokenFTDatasourceImpl } from "~/infrastructure/datasources/ftapi/tokkenFT.datasource"
import { JobOfferParser, JobOfferParserImpl } from "~/infrastructure/parser/jobOffer.parser"
import { JobOfferService, JobOfferServiceImpl } from "~/infrastructure/services/jobOffer.service"
import { JobOffer } from "../../entities/jobOffer.entity"
import { JobOfferFTQuery } from "~/infrastructure/datasources/ftapi/models/jobOfferQueryFT"
import { JobOfferHistory, JobOfferSource } from "~/domain/entities/databases/jobOfferHistory"
import { TextFilter } from "~/domain/entities/databases/textFilter.entity"
import { TextFilterDatasource, TextFilterDatasourceImpl } from "~/infrastructure/datasources/local/textFilter.datasource"
import { JobOfferHistoryDatasource, JobOfferHistoryDatasourceImpl } from "~/infrastructure/datasources/local/jobOfferHistory.datasource"
import { uuid } from "~/core/tools/uuid"

export interface GetJobOfferFTUsecase extends Usecase<JobOffer[], GetJobOfferFTUsecaseParams> {
    tokenFTDatasource: TokenFTDatasource
    jobOfferFtDatasource: JobOfferFTDatasource
    municipalityFtDatasource: MunicipalityFTDatasource
    textFilterDatasource: TextFilterDatasource
    jobOfferHistoryDatasource: JobOfferHistoryDatasource
    jobOfferService: JobOfferService
    jobOfferParser: JobOfferParser
}

export const GetJobOfferFTUsecaseImpl: GetJobOfferFTUsecase = {
    tokenFTDatasource: TokenFTDatasourceImpl,
    jobOfferFtDatasource: JobOfferFTDatasourceImpl,
    municipalityFtDatasource: MunicipalityFTDatasourceImpl,
    textFilterDatasource: TextFilterDatasourceImpl,
    jobOfferHistoryDatasource: JobOfferHistoryDatasourceImpl,
    jobOfferParser: JobOfferParserImpl,
    jobOfferService: JobOfferServiceImpl,

    perform: async function (params: GetJobOfferFTUsecaseParams): Promise<Result<JobOffer[]>> {
        try {
            // Generate a token needed to fetch data from france.travail API.
            const token = await this.tokenFTDatasource.generate()

            // Check query data send by users. (City/municipality code).
            const municipality = await this.municipalityFtDatasource.findOne(params.municipalityCode, token)
            if (!municipality) {
                return {
                    message: "The municipality code given does not exists in france.travail API references data.",
                    data: [],
                    errorCode: 404,
                } as Failure<JobOffer[]>
            }

            // Fetching : Job offer, filter text and historic value.
            const [jobOffersFT, textFilters, jobOfferHistories] = await Promise.all([
                this.jobOfferFtDatasource.findAll(
                    {
                        commune: params.municipalityCode,
                        motsCles: params.keywords,
                    } as JobOfferFTQuery,
                    token
                ),
                this.textFilterDatasource.findAll(),
                this.jobOfferHistoryDatasource.findAllBySource(JobOfferSource.ftapi),
            ])

            // Filtrage des offres d'emploi récupérées.
            const { jobOffersFTFiltered, newHistories } = await this.jobOfferService.filterJobOfferFT(jobOffersFT, textFilters, jobOfferHistories)

            // Mise à jour de l'historique des offres trouvés pour faciliter le prochain filtrage.
            await this.jobOfferHistoryDatasource.addMany(newHistories)

            // Parsing/normalisation des données pour notre API.
            const jobOffers = await this.jobOfferParser.parseFT(jobOffersFTFiltered)

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
    municipalityCode: string
}
