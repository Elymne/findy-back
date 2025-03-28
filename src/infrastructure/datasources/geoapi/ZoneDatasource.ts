import Zone from "@App/domain/models/Zone.model"
import ZoneRemoteRepository from "@App/domain/repositories/ZoneRemote.repository"
import axios, { type AxiosRequestConfig } from "axios"

export default class ZoneDatasource implements ZoneRemoteRepository {
    public async findAll(): Promise<Zone[]> {
        const options: AxiosRequestConfig = {
            method: "GET",
            url: `https://geo.api.gouv.fr/communes`,
            headers: {
                Accept: "application/json",
            },
            params: {
                fields: "centre",
                format: "json",
                geometry: "centre",
                boost: "population",
            },
        }

        const response = await axios.request<GeoApiModel[]>(options)

        return response.data.map((data) => {
            return {
                id: data.code,
                name: data.nom,
                lng: data.centre.coordinates[0],
                lat: data.centre.coordinates[1],
            }
        })
    }
}

interface GeoApiModel {
    nom: string
    code: string
    centre: {
        type: string
        coordinates: number[]
    }
}
