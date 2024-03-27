import axios from "axios"
import geoApiConst from "../configs/geoapi.const"
import GeoCity, { GeoCityCoordinated } from "../models/geoCity"

export interface GeoapiDatasource {
    findAll: () => Promise<GeoCity[]>
    findOneByCode: (code: string) => Promise<GeoCityCoordinated>
    findOneByName: (name: string) => Promise<GeoCityCoordinated>
}

export const GeoapiDatasourceImpl: GeoapiDatasource = {
    findAll: async function (): Promise<GeoCity[]> {
        const url = "".concat(`${geoApiConst.url}`, `/${geoApiConst.cityParam}`, `?${geoApiConst.boostQuery}=population`)

        const response = await axios.get<GeoCity[]>(url, {
            headers: {
                Accept: "application/json",
            },
        })
        return response.data
    },

    findOneByCode: async function (code: string): Promise<GeoCityCoordinated> {
        const url = "".concat(
            `${geoApiConst.url}`,
            `/${geoApiConst.cityParam}`,
            `/${code}`,
            `?${geoApiConst.fieldsQuery}=centre`,
            `&${geoApiConst.formatQuery}=json`,
            `&${geoApiConst.geometryQuery}=centre`,
            `&${geoApiConst.boostQuery}=population`,
            `&${geoApiConst.limitQuery}=1`
        )

        const response = await axios.get<GeoCityCoordinated>(url, {
            headers: {
                Accept: "application/json",
            },
        })
        return response.data
    },

    findOneByName: async function (name: string): Promise<GeoCityCoordinated> {
        const url = "".concat(
            `${geoApiConst.url}`,
            `/${geoApiConst.cityParam}`,
            `?${geoApiConst.fieldsQuery}=centre`,
            `&${geoApiConst.formatQuery}=json`,
            `&${geoApiConst.geometryQuery}=centre`,
            `&${geoApiConst.nameQuery}=${name}`,
            `&${geoApiConst.boostQuery}=population`,
            `&${geoApiConst.limitQuery}=1`
        )

        const response = await axios.get<GeoCityCoordinated[]>(url, {
            headers: {
                Accept: "application/json",
            },
        })
        return response.data[0]
    },
}
