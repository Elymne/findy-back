import axios from "axios"
import { JobOfferFTQuery } from "./models/jobOfferQueryFT"
import { TokenFT } from "./models/tokenFT"
import { ftpeApiUrl, ftpeApiVersion } from "./configs/ftapi.const"
import { JobOfferFT, JobOfferFTResponseBody } from "./models/jobOfferFT"

export interface JobOfferFtDatasource {
    findAll: (params: JobOfferFTQuery, token: TokenFT) => Promise<JobOfferFT[]>
}

export const JobOfferFTDatasourceImpl: JobOfferFtDatasource = {
    findAll: async function (query: JobOfferFTQuery, token: TokenFT): Promise<JobOfferFT[]> {
        const response = await axios.get<JobOfferFTResponseBody>(`${ftpeApiUrl}/${ftpeApiVersion}/offres/search`, {
            params: query,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token.access_token}`,
            },
        })

        return response.data.resultats
    },
}
