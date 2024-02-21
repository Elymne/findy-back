import axios from "axios"
import { MunicipalityFT } from "./models/municipalityFT"
import { TokenFT } from "./models/tokenFT"
import { ftpeApiUrl, ftpeApiVersion } from "./configs/ftapi.const"

export interface MunicipalityFTDatasource {
    findAll: (tokken: TokenFT) => Promise<MunicipalityFT[]>
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
}
