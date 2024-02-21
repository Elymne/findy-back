import { JobOfferFT } from "../datasources/ftapi/models/jobOfferFT"

export interface JobOfferService {
    filterJobOfferFT: (source: JobOfferFT[]) => Promise<JobOfferFT[]>
}

export const JobOfferServiceImpl: JobOfferService = {
    filterJobOfferFT: async function (source: JobOfferFT[]): Promise<JobOfferFT[]> {
        return source.filter((elem) => {
            return elem.alternance == true
        })
    },
}
