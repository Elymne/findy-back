import { Failure, Result, Success, Usecase } from "../../../core/interfaces/abstract.usecase"
import JobOffer from "../../entities/jobOffer.entity"
import TextFilter from "../../entities/textFilter.entity"
import KnownJobOffer from "../../entities/knownJobOffer.entity"
import { KnownJobOfferDatasource, KnownJobOfferDatasourceImpl } from "@App/infrastructure/native/datasources/knownJobOffer.datasource"
import { TextFilterDatasource, TextFilterDatasourceImpl } from "@App/infrastructure/native/datasources/textFilter.datasource"
import logger from "@App/core/tools/logger"
import uuid from "@App/core/tools/uuid"

type Params = {
    sources: JobOffer[]
}

export interface FilterJobOffersUsecase extends Usecase<JobOffer[], Params> {
    textFilterDatasource: TextFilterDatasource
    knownJobOfferDatasource: KnownJobOfferDatasource
}

export const FilterJobOffersUsecaseImpl: FilterJobOffersUsecase = {
    textFilterDatasource: TextFilterDatasourceImpl,
    knownJobOfferDatasource: KnownJobOfferDatasourceImpl,

    perform: async function (params: Params): Promise<Result<JobOffer[]>> {
        try {
            const [textFilters, kownJobOffers] = await Promise.all([
                this.textFilterDatasource.findAll(),
                this.knownJobOfferDatasource.findAll(),
            ])
            const result = new Array<JobOffer>()
            const newKnownJobOffers = new Array<KnownJobOffer>()

            for (const key in params.sources) {
                const checkResult = checkSource(params.sources[key], textFilters, kownJobOffers)
                if (!checkResult.isBanned) {
                    result.push(params.sources[key])
                }

                if (!checkResult.isKnown) {
                    newKnownJobOffers.push({
                        id: uuid(),
                        source_url: params.sources[key].sourceUrl,
                        source: params.sources[key].sourceData,
                        is_banned: checkResult.isBanned,
                    })
                }
            }

            await this.knownJobOfferDatasource.addMany(newKnownJobOffers)

            return new Success({
                message: "Jobs offers filtered successfully !",
                data: result,
            })
        } catch (error) {
            logger.error("[FilterJobOffersUsecase]", error)
            return new Failure({
                message: "An internal error occur",
                errorCode: 500,
            })
        }
    },
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
            } as CheckSourceResult
        }

        if (source.sourceUrl === kownJobOffers[key].source_url) {
            return {
                isKnown: true,
                isBanned: kownJobOffers[key].is_banned,
            } as CheckSourceResult
        }
    }

    if (!source.sourceUrl || !source.title || !source.companyName) {
        return {
            isKnown: false,
            isBanned: true,
        } as CheckSourceResult
    }

    for (const key in textFilters) {
        if (source.title.includes(textFilters[key].value) || source.companyName.includes(textFilters[key].value)) {
            return {
                isKnown: false,
                isBanned: true,
            } as CheckSourceResult
        }
    }

    return {
        isKnown: false,
        isBanned: false,
    } as CheckSourceResult
}
