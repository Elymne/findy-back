import { Failure, Result, Success, Usecase } from "../../../core/interfaces/abstract.usecase"
import JobOffer from "../../entities/jobOffer.entity"
import TextFilter from "../../entities/textFilter.entity"
import JobOfferHistory from "../../entities/jobOfferHistory"
import logger from "@App/core/tools/logger"
import uuid from "@App/core/tools/uuid"
import PageOffers from "@App/domain/entities/pageResult.entity"
import TextFilterDatasource, { TextFilterDatasourceImpl } from "@App/infrastructure/local/mongoDb/textFilter.datasource"
import JobOfferHistoryDatasource, { JobOfferHistoryDatasourceImpl } from "@App/infrastructure/local/mongoDb/jobOfferHistory.datasource"
import SourceSite from "@App/domain/enums/sourceData.enum"
import JobOfferHistoryModel from "@App/infrastructure/local/mongoDb/models/JobOfferHistory.model"

type Params = {
    sources: PageOffers
    sourceSite: SourceSite
}

export default interface FilterPageOffersUsecase extends Usecase<PageOffers, Params> {
    textFilterDatasource: TextFilterDatasource
    jobOfferHistoryDatasource: JobOfferHistoryDatasource
}

export const FilterPageOffersUsecaseImpl: FilterPageOffersUsecase = {
    textFilterDatasource: TextFilterDatasourceImpl,
    jobOfferHistoryDatasource: JobOfferHistoryDatasourceImpl,

    perform: async function (params: Params): Promise<Result<PageOffers>> {
        try {
            const [textFilters, kownJobOffers] = await Promise.all([
                this.textFilterDatasource.findAll(),
                this.jobOfferHistoryDatasource.findManyBySourceType(params.sourceSite),
            ])

            const jobOffersFiltered = new Array<JobOffer>()
            const newJobOfferHistories = new Array<JobOfferHistory>()

            for (const key in params.sources.jobOffers) {
                const jobOffer = params.sources.jobOffers[key]

                const checkResult = checkJobOffer(jobOffer, textFilters, kownJobOffers)
                if (!checkResult.isBanned) {
                    jobOffersFiltered.push(jobOffer)
                }

                if (!checkResult.isKnown) {
                    newJobOfferHistories.push({
                        id: uuid(),
                        source: jobOffer.sourceUrl,
                        sourceSite: jobOffer.sourceSite,
                        isBanned: checkResult.isBanned,
                    })
                }
            }

            await this.jobOfferHistoryDatasource.addMany(newJobOfferHistories as JobOfferHistoryModel[])

            return new Success({
                message: "Job offers from page filtered successfully !",
                data: {
                    totalPagesNb: params.sources.totalPagesNb,
                    jobOffers: jobOffersFiltered,
                },
            })
        } catch (error) {
            logger.error("[FilterPageOffersUsecase]", error)
            return new Failure({
                message: "An internal error occur",
                errorCode: 500,
            })
        }
    },
}

function checkJobOffer(
    jobOffer: JobOffer,
    textFilters: TextFilter[],
    jobOfferHistories: JobOfferHistory[]
): { isKnown: boolean; isBanned: boolean } {
    const response = doesExists(jobOffer, jobOfferHistories)

    if (response.isKnown) {
        return response as { isKnown: boolean; isBanned: boolean }
    }

    if (haveInvalidData(jobOffer) == true || containBannedText(jobOffer, textFilters) == true) {
        return { isKnown: false, isBanned: true }
    }

    return {
        isKnown: false,
        isBanned: false,
    }
}

function doesExists(jobOffer: JobOffer, jobOfferHistories: JobOfferHistory[]): { isKnown: boolean; isBanned: boolean | undefined } {
    for (const key in jobOfferHistories) {
        const jobOfferHistory = jobOfferHistories[key]
        if (jobOffer.sourceUrl === jobOfferHistory.source) {
            return {
                isKnown: true,
                isBanned: jobOfferHistory.isBanned,
            }
        }
    }

    return {
        isKnown: false,
        isBanned: undefined,
    }
}

function haveInvalidData(jobOffer: JobOffer): boolean {
    return jobOffer.sourceUrl == null || jobOffer.title == null || jobOffer.companyName == null
}

function containBannedText(jobOffer: JobOffer, textFilters: TextFilter[]): boolean {
    for (const key in textFilters) {
        const textFilter = textFilters[key]
        if (jobOffer.title.includes(textFilter.value) || jobOffer.companyName.includes(textFilter.value)) {
            return true
        }
    }
    return false
}
