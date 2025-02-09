import DetailedOffer from "@App/domain/models/DetailedOffer.model";
import Offer from "@App/domain/models/Offer.model";
import OfferRepository from "@App/domain/repositories/Offer.repository";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";

const baseUrl = "https://api.francetravail.io/partenaire/offresdemploi";

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

interface SearchParams {
    motsCles: string;
    commune: string;
    distance: number | null;
}

async function generateToken(): Promise<string> {
    const url = "https://entreprise.francetravail.fr/connexion/oauth2/access_token";
    const options: AxiosRequestConfig = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
            realm: "/partenaire",
        },
        data: {
            grant_type: "client_credentials",
            client_id: `${process.env.VUE_APP_FRANCE_TRAVAIL_API_KEY}`,
            client_secret: `${process.env.VUE_APP_FRANCE_TRAVAIL_API_KEY}`,
            scope: "o2dsoffre api_offresdemploiv2",
        },
    };
    const result = await axios.post(url, options);

    return result.data.access_token as string;
}

export const FranceTravailDatasource: OfferRepository = {
    findManyBySearch: async function (keyWords: string, codeZone: string, distance: number | null): Promise<Offer[]> {
        const url = `${baseUrl}/v2/offres/search`;
        const options: AxiosRequestConfig = {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${await generateToken()}`,
            },
            params: {
                motsCles: keyWords,
                commune: codeZone,
                distance: distance,
            } as SearchParams,
        };

        const response = await axios.get<FranceTravailModel[]>(url, options);

        return response.data.map((data) => {
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
    },

    findOne: async function (id: string): Promise<DetailedOffer | null> {
        const url = `${baseUrl}/v2/offres/${id}`;
        const options: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${await generateToken()}`,
                Accept: "application/json",
            },
        };

        const response = await axios.get<FranceTravailDetailedModel>(url, options);

        if (response.status == 204) {
            return null;
        }

        return null;
    },
};
