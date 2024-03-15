import axios from "axios"
import { JobOfferFT, JobOfferFTResponseBody } from "../models/jobOfferFT"
import { JobOfferFTQuery } from "../models/jobOfferQueryFT"
import { TokenFT } from "../models/tokenFT"
import { ftapiConst } from "../configs/ftapi.const"

export interface JobOfferFTDatasource {
    findAll: (params: JobOfferFTQuery, token: TokenFT) => Promise<JobOfferFT[]>
}

export const JobOfferFTDatasourceImpl: JobOfferFTDatasource = {
    findAll: async function (query: JobOfferFTQuery, token: TokenFT): Promise<JobOfferFT[]> {
        const response = await axios.get<JobOfferFTResponseBody>(`${ftapiConst.url}/${ftapiConst.version}/offres/search`, {
            params: query,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token.access_token}`,
            },
        })

        // ! france.travail send a 204 response when no data are found instead of an empty array.
        if (!response.data) return []

        return response.data.resultats
    },
}
