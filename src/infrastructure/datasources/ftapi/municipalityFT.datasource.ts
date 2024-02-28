import axios from "axios"
import { CityFT } from "./models/municipalityFT"
import { TokenFT } from "./models/tokenFT"
import { ftpeApiUrl, ftpeApiVersion } from "./configs/ftapi.const"

export interface CityFTDatasource {
    findAll: (tokken: TokenFT) => Promise<CityFT[]>
    findOne: (code: string, tokken: TokenFT) => Promise<CityFT | undefined>
}

export const CityFTDatasourceImpl: CityFTDatasource = {
    findAll: async function (tokken: TokenFT): Promise<CityFT[]> {
        const response = await axios.get<CityFT[]>(`${ftpeApiUrl}/${ftpeApiVersion}/referentiel/communes`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${tokken.access_token}`,
            },
        })

        return response.data
    },
    findOne: async function (code: string, tokken: TokenFT): Promise<CityFT | undefined> {
        const response = await axios.get<CityFT[]>(`${ftpeApiUrl}/${ftpeApiVersion}/referentiel/communes`, {
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
