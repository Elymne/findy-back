import axios from "axios"
import { GeoCity } from "./models/geoCity"
import { geoapiUrl, geoapiCity, geoapiDefinedQuery } from "./configs/geoapi.const"

export interface GeoapiDatasource {
    findOne: (code: string) => Promise<GeoCity>
}

export const GeoapiDatasourceImpl: GeoapiDatasource = {
    findOne: async function (code: string): Promise<GeoCity> {
        const response = await axios.get<GeoCity>(`${geoapiUrl}/${geoapiCity}?${geoapiDefinedQuery}`, {
            headers: {
                Accept: "application/json",
            },
        })
        return response.data
    },
}
