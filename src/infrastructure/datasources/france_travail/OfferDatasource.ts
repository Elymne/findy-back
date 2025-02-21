import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import generateToken from "./TokenDatasource";
import Offer from "@App/domain/models/Offer.model";
import OfferRepository from "@App/domain/repositories/Offer.repository";
import OfferDetailed from "@App/domain/models/OfferDetailed.model";
import { OfferDetailedModelFT, parseOfferDetailed } from "./parsers/offerDetailed.parser";
import { OfferResultModelFT, parseOffers } from "./parsers/offers.parser";

const baseUrl = "https://api.francetravail.io/partenaire/offresdemploi";

export default class OfferDatasource implements OfferRepository {
    // TODO : Lyon need to get fixed too. Check documentation from ft api.
    public async findManyBySearch(keyWords: string | null, codeZone: string | null, distance: number | null): Promise<Offer[]> {
        // ! Paris update. Cannot get data from FranceTravail APi with Paris insee code.
        let departmentCode = null;
        if (codeZone && codeZone == "75056") {
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
                motsCles: keyWords,
                commune: departmentCode ? null : codeZone,
                departement: departmentCode ? departmentCode : null,
                distance: distance ?? 30,
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
