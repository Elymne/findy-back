import DetailedOffer from "@App/domain/models/DetailedOffer.model";
import Offer from "@App/domain/models/Offer.model";
import OfferRepository from "@App/domain/repositories/Offer.repository";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import generateToken from "./FranceTravailDatasource";

export default class OfferDatasource implements OfferRepository {
    public async findManyBySearch(keyWords: string | null, codeZone: string | null, distance: number | null): Promise<Offer[]> {
        const options: AxiosRequestConfig = {
            method: "GET",
            url: `${baseUrl}/v2/offres/search`,
            headers: {
                Authorization: `Bearer ${await generateToken()}`,
                Accept: "application/json",
            },
            params: {
                motsCles: `Alternance ${keyWords}`,
                commune: codeZone,
                distance: distance,
            },
        };

        const response = await axios.request<OfferResultModelFT>(options);

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
                Authorization: `Bearer ${await generateToken()}`,
                Accept: "application/json",
            },
        };
        const response = await axios.get<OfferDetailedModelFT>(url, options);

        if (response.status == 204) {
            return null;
        }

        return null;
    }
}

const baseUrl = "https://api.francetravail.io/partenaire/offresdemploi";

interface OfferResultModelFT {
    resultats: OfferModelFT[];
}

interface OfferModelFT {
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

interface OfferDetailedModelFT {
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
