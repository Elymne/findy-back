import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import generateToken from "./generateToken";
import Offer from "@App/domain/models/Offer.model";
import OfferRemoteRepository from "@App/domain/repositories/OfferRemote.repository";
import OfferDetailed from "@App/domain/models/OfferDetailed.model";
import { OfferDetailedModelFT, parseOfferDetailed } from "./parsers/offerDetailed.parser";
import { OfferResultModelFT, parseOffers } from "./parsers/offers.parser";

const baseUrl = "https://api.francetravail.io/partenaire/offresdemploi";

export default class OfferRemoteDatasource implements OfferRemoteRepository {
    async findManyBySearch(params: { keyWords?: string; codeZone?: string; codeJob?: string; distance?: number }): Promise<Offer[]> {
        // ! Paris update. Cannot get data from FranceTravail APi with Paris insee code.
        let departmentCode = null;
        if (params.codeZone && params.codeZone == "75056") {
            departmentCode = "75";
        }

        const options: AxiosRequestConfig = {
            method: "GET",
            url: `${baseUrl}/v2/offres/search`,
            headers: {
                Authorization: `Bearer ${await generateToken()}`,
                Accept: "application/json",
            },
            params: {
                motsCles: params.keyWords,
                commune: departmentCode ? null : params.codeZone,
                departement: departmentCode ? departmentCode : null,
                distance: params.distance ?? 30,
                secteurActivite: params.codeJob,
                natureContrat: "E2",
                modeSelectionPartenaires: "INCLUS",
            },
        };

        const response = await axios.request<OfferResultModelFT>(options);

        if (response.status != 206 && response.status != 200) {
            return [];
        }

        return parseOffers(response.data);
    }

    public async findOne(id: string): Promise<OfferDetailed | null> {
        const options: AxiosRequestConfig = {
            url: `${baseUrl}/v2/offres/${id}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${await generateToken()}`,
                Accept: "application/json",
            },
        };

        const response = await axios.request<OfferDetailedModelFT>(options);

        if (response.status != 200) {
            return null;
        }

        return parseOfferDetailed(response.data);
    }
}
