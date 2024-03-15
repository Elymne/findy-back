import axios from "axios"
import { GeoCity } from "../models/geoCity"
import { geoApiConst } from "../configs/geoapi.const"

export interface GeoapiDatasource {
    findOne: (code: string) => Promise<GeoCity>
}

export const GeoapiDatasourceImpl: GeoapiDatasource = {
    findOne: async function (code: string): Promise<GeoCity> {
        const response = await axios.get<GeoCity>(`${geoApiConst.url}/${geoApiConst.city}/${code}?${geoApiConst.staticQuery}`, {
            headers: {
                Accept: "application/json",
            },
        })
        return response.data
    },
}
