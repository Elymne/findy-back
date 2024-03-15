import { TextFilter } from "@App/domain/entities/textFilter.entity"
import { JobOfferWTTJ } from "../datasources/wttj/models/JobOfferWTTJ"
import { uuid } from "@App/core/uuid"
import { KnownJobOffer } from "@App/domain/entities/knownJobOffer.entity"
import { SourceSite } from "@App/domain/entities/enums/sourceData.enum"

export interface JobOfferWTTJService {
    filter: (
        source: JobOfferWTTJ[],
        filters: TextFilter[],
        KnownJobOffer: KnownJobOffer[]
    ) => Promise<{ sourceFiltered: JobOfferWTTJ[]; newKnownJobOffers: KnownJobOffer[] }>
}

export const JobOfferWTTJServiceImpl: JobOfferWTTJService = {
    filter: async function (
        source: JobOfferWTTJ[],
        filters: TextFilter[],
        KnownJobOffer: KnownJobOffer[]
    ): Promise<{ sourceFiltered: JobOfferWTTJ[]; newKnownJobOffers: KnownJobOffer[] }> {
        const newKnownJobOffers: KnownJobOffer[] = []

        const result = source.filter((elem) => {
            const f = KnownJobOffer.filter((history) => history.source_url == elem.accessUrl)
            if (f.length != 0) {
                return !f[0].is_banned
            }

            const foundFilters = filters.filter((filter) => {
                return elem.title.includes(filter.value) || elem.company.includes(filter.value)
            })
            if (foundFilters.length != 0) {
                newKnownJobOffers.push({
                    id: uuid(),
                    source_url: elem.accessUrl,
                    source: SourceSite.WTTJ,
                    is_banned: true,
                })
                return false
            }

            newKnownJobOffers.push({
                id: uuid(),
                source_url: elem.accessUrl,
                is_banned: false,
                source: SourceSite.WTTJ,
            })
            return true
        })

        return { sourceFiltered: result, newKnownJobOffers: newKnownJobOffers }
    },
}
