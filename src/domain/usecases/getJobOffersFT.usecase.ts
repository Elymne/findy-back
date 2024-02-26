import { logger } from "~/core/tools/logger"
import { Failure, Result, Success, Usecase } from "~/core/usecase"
import { JobOffer } from "../entities/jobOffer.entity"
import { TokenFTDatasource, TokenFTDatasourceImpl } from "~/infrastructure/datasources/ftapi/tokken.datasource"
import { JobOfferFTDatasourceImpl, JobOfferFtDatasource } from "~/infrastructure/datasources/ftapi/jobOfferFt.datasource"
import { JobOfferParser, JobOfferParserImpl } from "~/infrastructure/parser/jobOffer.parser"
import { JobOfferService, JobOfferServiceImpl } from "~/infrastructure/services/jobOffer.service"
import { MunicipalityFTDatasource, MunicipalityFTDatasourceImpl } from "~/infrastructure/datasources/ftapi/municipalityFT.datasource"

export interface GetJobOfferFTUsecase extends Usecase<JobOffer[], GetJobOfferFTUsecaseParams> {
    tokenFTDatasource: TokenFTDatasource
    jobOfferFtDatasource: JobOfferFtDatasource
    municipalityFtDatasource: MunicipalityFTDatasource
    jobOfferService: JobOfferService
    jobOfferParser: JobOfferParser
}

export const GetJobOfferFTUsecaseImpl: GetJobOfferFTUsecase = {
    tokenFTDatasource: TokenFTDatasourceImpl,
    jobOfferFtDatasource: JobOfferFTDatasourceImpl,
    municipalityFtDatasource: MunicipalityFTDatasourceImpl,
    jobOfferParser: JobOfferParserImpl,
    jobOfferService: JobOfferServiceImpl,

    perform: async function (params: GetJobOfferFTUsecaseParams): Promise<Result<JobOffer[]>> {
        try {
            const token = await this.tokenFTDatasource.generate()

            const municipality = await this.municipalityFtDatasource.findOne(params.municipalityCode, token)
            if (!municipality) {
                return {
                    message: "The municipality code given does not exists in france.travail API references data.",
                    data: [],
                    errorCode: 404,
                } as Failure<JobOffer[]>
            }

            const jobOffersFT = await this.jobOfferFtDatasource.findAll(
                {
                    commune: params.municipalityCode,
                    motsCles: params.keywords,
                },
                token
            )

            const jobOffersFTFiltered = await this.jobOfferService.filterJobOfferFT(jobOffersFT)

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
