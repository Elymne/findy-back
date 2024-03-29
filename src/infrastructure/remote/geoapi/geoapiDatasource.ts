import axios from "axios"
import geoApiConst from "./configs/geoapi.const"
import GeoCity, { GeoCityCoordinated } from "./models/geoCity"
import City, { CityWithCoordinates } from "@App/domain/entities/city.entity"
import { GeoApiParser, GeoApiParserImpl } from "./parsers/geoApi.parser"

export interface GeoapiDatasource {
    geoApiParser: GeoApiParser
    findAll: () => Promise<City[]>
    findOneByCode: (code: string) => Promise<CityWithCoordinates>
    findOneByName: (name: string) => Promise<CityWithCoordinates>
}

export const GeoapiDatasourceImpl: GeoapiDatasource = {
    geoApiParser: GeoApiParserImpl,

    findAll: async function (): Promise<City[]> {
        const url = "".concat(`${geoApiConst.url}`, `/${geoApiConst.cityParam}`, `?${geoApiConst.boostQuery}=population`)

        const geoCitiesResponse = await axios.get<GeoCity[]>(url, {
            headers: {
                Accept: "application/json",
            },
        })

        const cities = await this.geoApiParser.parse(geoCitiesResponse.data)

        return cities
    },

    findOneByCode: async function (code: string): Promise<CityWithCoordinates> {
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

        const geoCityResponse = await axios.get<GeoCityCoordinated | undefined>(url, {
            headers: {
                Accept: "application/json",
            },
        })

        if (!geoCityResponse.data) {
            throw Error(`No city found with code : ${code}`)
        }

        const city = this.geoApiParser.parseOne(geoCityResponse.data)

        return city
    },

    findOneByName: async function (name: string): Promise<CityWithCoordinates> {
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

        const geoCitiesResponse = await axios.get<GeoCityCoordinated[]>(url, {
            headers: {
                Accept: "application/json",
            },
        })

        if (geoCitiesResponse.data.length === 0) {
            throw Error(`No city found with name : ${name}`)
        }

        const city = this.geoApiParser.parseOne(geoCitiesResponse.data[0])

        return city
    },
}
