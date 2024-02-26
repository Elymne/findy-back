import axios from "axios"
import { MunicipalityFT } from "./models/municipalityFT"
import { TokenFT } from "./models/tokenFT"
import { ftpeApiUrl, ftpeApiVersion } from "./configs/ftapi.const"

export interface MunicipalityFTDatasource {
    findAll: (tokken: TokenFT) => Promise<MunicipalityFT[]>
    findOne: (code: string, tokken: TokenFT) => Promise<MunicipalityFT | undefined>
}

export const MunicipalityFTDatasourceImpl: MunicipalityFTDatasource = {
    findAll: async function (tokken: TokenFT): Promise<MunicipalityFT[]> {
        const response = await axios.get<MunicipalityFT[]>(`${ftpeApiUrl}/${ftpeApiVersion}/referentiel/communes`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${tokken.access_token}`,
            },
        })

        return response.data
    },
    findOne: async function (code: string, tokken: TokenFT): Promise<MunicipalityFT | undefined> {
        const response = await axios.get<MunicipalityFT[]>(`${ftpeApiUrl}/${ftpeApiVersion}/referentiel/communes`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${tokken.access_token}`,
            },
        })

        return response.data.find((elem) => {
            return elem.code == code
        })
    },
}
