import { JobOfferHistory } from "~/domain/entities/databases/jobOfferHistory"
import { JobOfferFT } from "../datasources/ftapi/models/jobOfferFT"
import { TextFilter } from "~/domain/entities/databases/textFilter.entity"
import { v4 as uuidv4 } from "uuid"

export interface JobOfferService {
    filterJobOfferFT: (source: JobOfferFT[], filters: TextFilter[], histories: JobOfferHistory[]) => Promise<{ jobOffersFTFiltered: JobOfferFT[]; newHistories: JobOfferHistory[] }>
}

export const JobOfferServiceImpl: JobOfferService = {
    filterJobOfferFT: async function (source: JobOfferFT[], filters: TextFilter[], histories: JobOfferHistory[]): Promise<{ jobOffersFTFiltered: JobOfferFT[]; newHistories: JobOfferHistory[] }> {
        const newHistories: JobOfferHistory[] = []

        const result = source.filter((elem) => {
            // Checking if this job has already been fetched by our API. (Quick solution)
            const f = histories.filter((history) => history.source_id == elem.id)
            if (f.length != 0) return !f[0].is_banned

            // Check by attribute from france.travail API.
            if (elem.alternance == false) {
                newHistories.push({
                    id: uuidv4(),
                    source_id: elem.id,
                    is_banned: true,
                    source: "ftapi",
                })
                return false
            }

            // Check by string fact.
            filters.forEach((filter) => {
                if (elem.intitule.includes(filter.value)) {
                    newHistories.push({
                        id: uuidv4(),
                        source_id: elem.id,
                        is_banned: true,
                        source: "ftapi",
                    })
                    return false
                }
            })

            newHistories.push({
                id: uuidv4(),
                source_id: elem.id,
                is_banned: false,
                source: "ftapi",
            })
            return true
        })

        return { jobOffersFTFiltered: result, newHistories: newHistories }
    },
}
