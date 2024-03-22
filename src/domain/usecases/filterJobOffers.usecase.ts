import { Failure, Result, Success, Usecase } from "./abstract.usecase"
import { TextFilterDatasource, TextFilterDatasourceImpl } from "@App/infrastructure/local/datasources/textFilter.datasource"
import { KnownJobOfferDatasource, KnownJobOfferDatasourceImpl } from "@App/infrastructure/local/datasources/knownJobOffer.datasource"
import uuid from "@App/core/uuid"
import logger from "@App/core/logger"
import JobOffer from "../entities/jobOffer.entity"
import TextFilter from "../entities/textFilter.entity"
import KnownJobOffer from "../entities/knownJobOffer.entity"

type _Params = {
    sources: JobOffer[]
}

export interface FilterJobOffersUsecase extends Usecase<JobOffer[], _Params> {
    textFilterDatasource: TextFilterDatasource
    knownJobOfferDatasource: KnownJobOfferDatasource
}

export const FilterJobOffersUsecaseImpl: FilterJobOffersUsecase = {
    textFilterDatasource: TextFilterDatasourceImpl,
    knownJobOfferDatasource: KnownJobOfferDatasourceImpl,

    perform: async function (params: _Params): Promise<Result<JobOffer[]>> {
        try {
            const [textFilters, kownJobOffers] = await Promise.all([
                this.textFilterDatasource.findAll(),
                this.knownJobOfferDatasource.findAll(),
            ])
            const result = new Array<JobOffer>()
            const newKnownJobOffers = new Array<KnownJobOffer>()

            for (const source of params.sources) {
                const checkResult = checkSource(source, textFilters, kownJobOffers)
                if (!checkResult.isBanned) {
                    result.push(source)
                }

                if (!checkResult.isKnown) {
                    newKnownJobOffers.push({
                        id: uuid(),
                        source_url: source.sourceUrl,
                        source: source.sourceData,
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
    for (const kownJobOffer of kownJobOffers) {
        if (source.id && source.id === kownJobOffer.source_id) {
            return {
                isKnown: true,
                isBanned: kownJobOffer.is_banned,
            } as CheckSourceResult
        }

        if (source.sourceUrl === kownJobOffer.source_url) {
            return {
                isKnown: true,
                isBanned: kownJobOffer.is_banned,
            } as CheckSourceResult
        }
    }

    for (const textFilter of textFilters) {
        if (source.title.includes(textFilter.value) || source.companyName.includes(textFilter.value)) {
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
