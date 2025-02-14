import axios, { AxiosRequestConfig } from "axios";
import qs from "querystring";

export default async function generateToken(): Promise<string> {
    const options: AxiosRequestConfig = {
        method: "POST",
        url: baseUrl,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
            realm: "/partenaire",
        },
        data: qs.stringify({
            grant_type: "client_credentials",
            client_id: process.env.VUE_APP_FRANCE_TRAVAIL_API_ID,
            client_secret: process.env.VUE_APP_FRANCE_TRAVAIL_API_KEY,
            scope: scope,
        }),
    };

    const result = await axios.request<TokenModel>(options);

    return result.data.access_token;
}

const baseUrl = "https://entreprise.francetravail.fr/connexion/oauth2/access_token";
const scope = "api_rome-metiersv1 nomenclatureRome api_offresdemploiv2 o2dsoffre api_eterritoirev1";

interface TokenModel {
    scope: string;
    expires_in: number;
    token_type: string;
    access_token: string;
}
