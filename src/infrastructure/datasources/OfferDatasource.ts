import DetailedOffer from "@App/domain/models/DetailedOffer.model";
import Offer from "@App/domain/models/Offer.model";
import OfferRepository from "@App/domain/repositories/Offer.repository";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import qs from "querystring";

export default class OfferDatasource implements OfferRepository {
    public async findManyBySearch(keyWords: string | null, codeZone: string | null, distance: number | null): Promise<Offer[]> {
        const options: AxiosRequestConfig = {
            method: "GET",
            url: `${baseUrl}/v2/offres/search`,
            headers: {
                Authorization: `Bearer ${await this.generateToken()}`,
                Accept: "application/json",
            },
            params: {
                motsCles: keyWords,
                commune: codeZone,
                distance: distance,
            },
        };

        const response = await axios.request<FranceTravailResultModel>(options);

        if (response.status != 206 && response.status != 200) {
            return [];
        }

        return response.data.resultats.map((data) => {
            return {
                id: data.id,
                title: data.intitule,
                description: data.description,
                company: data.entreprise.nom,
                companyLogo: data.entreprise.logo,
                zone: data.lieuTravail.libelle,
                jobTitle: data.appellationlibelle,
                createdAt: new Date(data.dateCreation),
                updateAt: new Date(data.dateActualisation),
                imgUrl: null,

                tags: [],
            };
        });
    }

    public async findOne(id: string): Promise<DetailedOffer | null> {
        const url = `${baseUrl}/v2/offres/${id}`;
        const options: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${await this.generateToken()}`,
                Accept: "application/json",
            },
        };
        const response = await axios.get<FranceTravailDetailedModel>(url, options);

        if (response.status == 204) {
            return null;
        }

        return null;
    }

    private async generateToken(): Promise<string> {
        const options: AxiosRequestConfig = {
            method: "POST",
            url: "https://entreprise.francetravail.fr/connexion/oauth2/access_token",
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
                scope: "api_offresdemploiv2 o2dsoffre",
            }),
        };

        const result = await axios.request<TokenModel>(options);

        return result.data.access_token;
    }
}

const baseUrl = "https://api.francetravail.io/partenaire/offresdemploi";

interface TokenModel {
    scope: string;
    expires_in: number;
    token_type: string;
    access_token: string;
}

interface FranceTravailResultModel {
    resultats: FranceTravailModel[];
}

interface FranceTravailModel {
    id: string;
    intitule: string;
    description: string;
    entreprise: {
        nom: string;
        logo: string;
    };
    lieuTravail: {
        libelle: string;
    };
    appellationlibelle: string;
    dateCreation: string;
    dateActualisation: string;
}

interface FranceTravailDetailedModel {
    id: string;
    intitule: string;
    description: string;
    entreprise: {
        nom: string;
        logo: string;
    };
    lieuTravail: {
        libelle: string;
    };
    appellationlibelle: string;
    dateCreation: string;
    dateActualisation: string;
}
