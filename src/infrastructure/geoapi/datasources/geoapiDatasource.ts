import axios from "axios"
import { GeoCity } from "../models/geoCity"
import { geoApiConst } from "../configs/geoapi.const"

export interface GeoapiDatasource {
    findAll: () => Promise<GeoCity[]>
    findOneByCode: (code: string) => Promise<GeoCity>
    findOneByName: (name: string) => Promise<GeoCity>
}

export const GeoapiDatasourceImpl: GeoapiDatasource = {
    findAll: async function (): Promise<GeoCity[]> {
        const url = "".concat(
            `${geoApiConst.url}`,
            `/${geoApiConst.cityParam}`,
            `?${geoApiConst.fieldsQuery}=centre`,
            `&${geoApiConst.formatQuery}=json`,
            `&${geoApiConst.geometryQuery}=centre`,
            `&${geoApiConst.boostQuery}=population`
        )
        const response = await axios.get<GeoCity[]>(url, {
            headers: {
                Accept: "application/json",
            },
        })
        return response.data
    },

    findOneByCode: async function (code: string): Promise<GeoCity> {
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

        const response = await axios.get<GeoCity>(url, {
            headers: {
                Accept: "application/json",
            },
        })
        return response.data
    },

    findOneByName: async function (name: string): Promise<GeoCity> {
        const url = "".concat(
            `${geoApiConst.url}`,
            `/${geoApiConst.cityParam}`,
            `?${geoApiConst.fieldsQuery}=centre`,
            `&${geoApiConst.formatQuery}=json`,
            `&${geoApiConst.geometryQuery}=centre`,
            `&${geoApiConst.boostQuery}=population`,
            `&${geoApiConst.nameQuery}=${name}`,
            `&${geoApiConst.limitQuery}=1`
        )

        const response = await axios.get<GeoCity>(url, {
            headers: {
                Accept: "application/json",
            },
        })
        return response.data
    },
}
