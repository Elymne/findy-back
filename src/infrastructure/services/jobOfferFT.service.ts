import { JobOfferHistory, JobOfferSource } from "@App/domain/entities/jobOfferHistory.entity"
import { JobOfferFT } from "../datasources/ftapi/models/jobOfferFT"
import { TextFilter } from "@App/domain/entities/textFilter.entity"
import { uuid } from "@App/core/tools/uuid"

export interface JobOfferFTService {
    filter: (
        source: JobOfferFT[],
        filters: TextFilter[],
        histories: JobOfferHistory[]
    ) => Promise<{ jobOfferFTFiltered: JobOfferFT[]; newHistories: JobOfferHistory[] }>
}

export const JobOfferFTServiceImpl: JobOfferFTService = {
    filter: async function (
        source: JobOfferFT[],
        filters: TextFilter[],
        histories: JobOfferHistory[]
    ): Promise<{ jobOfferFTFiltered: JobOfferFT[]; newHistories: JobOfferHistory[] }> {
        const newHistories: JobOfferHistory[] = []
        const result = source.filter((elem) => {
            const f = histories.filter((history) => history.source_id == elem.id)
            if (f.length != 0) return !f[0].is_banned

            if (elem.alternance == false) {
                newHistories.push({
                    id: uuid(),
                    source_id: elem.id,
                    is_banned: true,
                    source: JobOfferSource.ftapi,
                })
                return false
            }

            filters.forEach((filter) => {
                if (elem.intitule.includes(filter.value)) {
                    newHistories.push({
                        id: uuid(),
                        source_id: elem.id,
                        is_banned: true,
                        source: JobOfferSource.ftapi,
                    })
                    return false
                }
            })

            newHistories.push({
                id: uuid(),
                source_id: elem.id,
                is_banned: false,
                source: JobOfferSource.ftapi,
            })
            return true
        })
        return { jobOfferFTFiltered: result, newHistories: newHistories }
    },
}
