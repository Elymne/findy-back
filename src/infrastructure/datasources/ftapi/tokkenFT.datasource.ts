import axios from "axios"
import { TokenFT } from "./models/tokenFT"
import { ftapiScopes, ftapiTokenUrl } from "./configs/ftapi.const"

export interface TokenFTDatasource {
    generate: () => Promise<TokenFT>
}

export const TokenFTDatasourceImpl: TokenFTDatasource = {
    generate: async function (): Promise<TokenFT> {
        const response = await axios.post<TokenFT>(
            `${ftapiTokenUrl}`,
            {
                grant_type: "client_credentials",
                client_id: process.env.FRANCE_TRAVAIL_ID,
                client_secret: process.env.FRANCE_TRAVAIL_KEY,
                scope: ftapiScopes,
            },
            {
                params: {
                    realm: "/partenaire",
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        )

        return response.data
    },
}
