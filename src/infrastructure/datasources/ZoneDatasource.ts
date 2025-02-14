import Zone from "@App/domain/models/Zone.model";
import ZoneRepository from "@App/domain/repositories/Zone.repository";
import axios, { type AxiosRequestConfig } from "axios";

export default class ZoneDatasource implements ZoneRepository {
    public async findAll(text: string): Promise<Zone[]> {
        const options: AxiosRequestConfig = {
            method: "GET",
            url: `${baseUrl}/communes`,
            headers: {
                Accept: "application/json",
            },
            params: {
                fields: "centre",
                format: "json",
                geometry: "centre",
                boost: "population",
                limitQuery: "10",
                nom: text,
            },
        };

        const response = await axios.request<GeoApiModel[]>(options);

        return response.data.map((data) => {
            return {
                name: data.nom,
                postalCode: data.code,
                lng: data.centre.coordinates[0],
                lat: data.centre.coordinates[1],
            };
        });
    }

    public async findOne(code: string): Promise<Zone | null> {
        const options: AxiosRequestConfig = {
            url: `${baseUrl}/communes/${code}`,
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            params: {
                fields: "centre",
                format: "json",
                geometry: "centre",
                boost: "population",
                limitQuery: "1",
            },
        };

        const response = await axios.request<GeoApiModel | undefined>(options);

        if (response.data == undefined) {
            return null;
        }

        return {
            name: response.data.nom,
            postalCode: response.data.code,
            lng: response.data.centre.coordinates[0],
            lat: response.data.centre.coordinates[1],
        };
    }
}

const baseUrl = "https://geo.api.gouv.fr";

interface GeoApiModel {
    nom: string;
    code: string;
    centre: {
        type: string;
        coordinates: number[];
    };
}
