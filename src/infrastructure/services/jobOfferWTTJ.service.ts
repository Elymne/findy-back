import { TextFilter } from "@App/domain/entities/databases/textFilter.entity"
import { JobOfferWTTJ } from "../datasources/wttj/models/JobOfferWTTJ"
import { JobOfferHistory, JobOfferSource } from "@App/domain/entities/databases/jobOfferHistory"
import { uuid } from "@App/core/tools/uuid"

export interface JobOfferWTTJService {
    filter: (
        source: JobOfferWTTJ[],
        filters: TextFilter[],
        histories: JobOfferHistory[]
    ) => Promise<{ jobOffersWTTJFiltered: JobOfferWTTJ[]; newHistories: JobOfferHistory[] }>
}

export const JobOfferWTTJServiceImpl: JobOfferWTTJService = {
    filter: async function (
        source: JobOfferWTTJ[],
        filters: TextFilter[],
        histories: JobOfferHistory[]
    ): Promise<{ jobOffersWTTJFiltered: JobOfferWTTJ[]; newHistories: JobOfferHistory[] }> {
        const newHistories: JobOfferHistory[] = []

        const result = source.filter((elem) => {
            const f = histories.filter((history) => history.source_url == elem.accessUrl)
            if (f.length != 0) return !f[0].is_banned

            filters.forEach((filter) => {
                if (elem.title.includes(filter.value)) {
                    newHistories.push({
                        id: uuid,
                        source_url: elem.accessUrl,
                        is_banned: true,
                        source: JobOfferSource.wttj,
                    })
                    return false
                }
            })

            newHistories.push({
                id: uuid,
                source_url: elem.accessUrl,
                is_banned: false,
                source: JobOfferSource.wttj,
            })
            return true
        })

        return { jobOffersWTTJFiltered: result, newHistories: newHistories }
    },
}
