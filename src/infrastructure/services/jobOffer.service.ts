import { DetailedJobOfferFT } from "../datasources/ftapi/models/detailedJobOfferFT"
import { JobOfferFT } from "../datasources/ftapi/models/jobOfferFT"

export interface JobOfferService {
    filterJobOfferFT: (source: JobOfferFT[]) => Promise<JobOfferFT[]>
    filterJobOfferDetailedFT: (source: DetailedJobOfferFT[]) => Promise<DetailedJobOfferFT[]>
}

export const JobOfferServiceImpl: JobOfferService = {
    filterJobOfferFT: async function (source: JobOfferFT[]): Promise<JobOfferFT[]> {
        return source.filter((elem) => {
            return elem.alternance == true
        })
    },
    filterJobOfferDetailedFT: async function (source: DetailedJobOfferFT[]): Promise<DetailedJobOfferFT[]> {
        return source.filter((elem) => {
            return elem.alternance == true
        })
    },
}
