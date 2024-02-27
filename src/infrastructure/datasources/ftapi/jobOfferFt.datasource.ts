import axios from "axios"
import { ftpeApiUrl, ftpeApiVersion } from "./configs/ftapi.const"
import { JobOfferFT, JobOfferFTResponseBody } from "./models/jobOfferFT"
import { JobOfferFTQuery } from "./models/jobOfferQueryFT"
import { TokenFT } from "./models/tokenFT"

export interface JobOfferFTDatasource {
    findAll: (params: JobOfferFTQuery, token: TokenFT) => Promise<JobOfferFT[]>
}

export const JobOfferFTDatasourceImpl: JobOfferFTDatasource = {
    findAll: async function (query: JobOfferFTQuery, token: TokenFT): Promise<JobOfferFT[]> {
        const response = await axios.get<JobOfferFTResponseBody>(`${ftpeApiUrl}/${ftpeApiVersion}/offres/search`, {
            params: query,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token.access_token}`,
            },
        })

        // ? france.travail send a 204 response when no data are found instead of an empty array.
        if (!response.data) return []

        return response.data.resultats
    },
}
