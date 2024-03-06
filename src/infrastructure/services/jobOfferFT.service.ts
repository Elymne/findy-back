import { JobOfferFT } from "../datasources/ftapi/models/jobOfferFT"
import { TextFilter } from "@App/domain/entities/textFilter.entity"
import { uuid } from "@App/core/tools/uuid"
import { KnownJobOffer } from "@App/domain/entities/knownJobOffer.entity"
import { SourceSite } from "@App/domain/entities/enums/sourceData.enum"

export interface JobOfferFTService {
    filter: (
        source: JobOfferFT[],
        filters: TextFilter[],
        knownJobOffers: KnownJobOffer[]
    ) => Promise<{ jobOfferFTFiltered: JobOfferFT[]; newKnownJobOffers: KnownJobOffer[] }>
}

export const JobOfferFTServiceImpl: JobOfferFTService = {
    filter: async function (
        source: JobOfferFT[],
        filters: TextFilter[],
        knownJobOffers: KnownJobOffer[]
    ): Promise<{ jobOfferFTFiltered: JobOfferFT[]; newKnownJobOffers: KnownJobOffer[] }> {
        const newKnownJobOffers: KnownJobOffer[] = []

        const result = source.filter((elem) => {
            const f = knownJobOffers.filter((history) => history.source_id == elem.id)
            if (f.length != 0) {
                return !f[0].is_banned
            }

            if (elem.alternance == false) {
                newKnownJobOffers.push({
                    id: uuid(),
                    source_id: elem.id,
                    is_banned: true,
                    source: SourceSite.FTAPI,
                })
                return false
            }

            filters.forEach((filter) => {
                if (elem.intitule.includes(filter.value)) {
                    newKnownJobOffers.push({
                        id: uuid(),
                        source_id: elem.id,
                        is_banned: true,
                        source: SourceSite.FTAPI,
                    })
                    return false
                }
            })

            newKnownJobOffers.push({
                id: uuid(),
                source_id: elem.id,
                is_banned: false,
                source: SourceSite.FTAPI,
            })
            return true
        })
        return { jobOfferFTFiltered: result, newKnownJobOffers: newKnownJobOffers }
    },
}
