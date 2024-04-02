import { Failure, Result, Success, Usecase } from "../../../core/interfaces/abstract.usecase"
import JobOffer from "../../entities/jobOffer.entity"
import TextFilter from "../../entities/textFilter.entity"
import KnownJobOffer from "../../entities/knownJobOffer.entity"
import logger from "@App/core/tools/logger"
import uuid from "@App/core/tools/uuid"
import PageOffers from "@App/domain/entities/pageResult.entity"
import KnownJobOfferDatasource, { KnownJobOfferDatasourceImpl } from "@App/infrastructure/local/knownJobOffer.datasource"
import TextFilterDatasource, { TextFilterDatasourceImpl } from "@App/infrastructure/local/textFilter.datasource"

export default interface FilterPageOffersUsecase extends Usecase<PageOffers, Params> {
    textFilterDatasource: TextFilterDatasource
    knownJobOfferDatasource: KnownJobOfferDatasource
}

export const FilterPageOffersUsecaseImpl: FilterPageOffersUsecase = {
    textFilterDatasource: TextFilterDatasourceImpl,
    knownJobOfferDatasource: KnownJobOfferDatasourceImpl,

    perform: async function (params: Params): Promise<Result<PageOffers>> {
        try {
            const [textFilters, kownJobOffers] = await Promise.all([
                this.textFilterDatasource.findAll(),
                this.knownJobOfferDatasource.findAll(),
            ])

            const jobOffersFiltered = new Array<JobOffer>()
            const newKnownJobOffers = new Array<KnownJobOffer>()

            for (const key in params.sources.jobOffers) {
                const checkResult = checkSource(params.sources.jobOffers[key], textFilters, kownJobOffers)
                if (!checkResult.isBanned) {
                    jobOffersFiltered.push(params.sources.jobOffers[key])
                }

                if (!checkResult.isKnown) {
                    newKnownJobOffers.push({
                        id: uuid(),
                        source_url: params.sources.jobOffers[key].sourceUrl,
                        source: params.sources.jobOffers[key].sourceData,
                        is_banned: checkResult.isBanned,
                    })
                }
            }

            await this.knownJobOfferDatasource.addMany(newKnownJobOffers)

            const pageOffersFiltered: PageOffers = {
                totalPagesNb: params.sources.totalPagesNb,
                jobOffers: jobOffersFiltered,
            }

            return new Success({
                message: "Job offers from page filtered successfully !",
                data: pageOffersFiltered,
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

type Params = {
    sources: PageOffers
}

type CheckSourceResult = {
    isKnown: boolean
    isBanned: boolean
}
function checkSource(source: JobOffer, textFilters: TextFilter[], kownJobOffers: KnownJobOffer[]): CheckSourceResult {
    for (const key in kownJobOffers) {
        if (source.id && source.id === kownJobOffers[key].source_id) {
            return {
                isKnown: true,
                isBanned: kownJobOffers[key].is_banned,
            }
        }

        if (source.sourceUrl === kownJobOffers[key].source_url) {
            return {
                isKnown: true,
                isBanned: kownJobOffers[key].is_banned,
            }
        }
    }

    if (!source.sourceUrl || !source.title || !source.companyName) {
        return {
            isKnown: false,
            isBanned: true,
        }
    }

    for (const key in textFilters) {
        if (source.title.includes(textFilters[key].value) || source.companyName.includes(textFilters[key].value)) {
            return {
                isKnown: false,
                isBanned: true,
            }
        }
    }

    return {
        isKnown: false,
        isBanned: false,
    }
}
