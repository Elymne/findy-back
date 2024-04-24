import axios from "axios"
import geoApiConst from "./configs/geoapi.const"
import GeoCity, { GeoCityCoordinated } from "./models/geoCity"
import City, { CityWithCoordinates } from "@App/domain/entities/city.entity"
import GeoApiParser, { GeoApiParserImpl } from "./parsers/geoApi.parser"

export default interface GeoapiDatasource {
    geoApiParser: GeoApiParser
    findAll: () => Promise<City[]>
    findManyByName: (name: string) => Promise<CityWithCoordinates[]>
    findOneByCode: (code: string) => Promise<CityWithCoordinates>
}

export const GeoapiDatasourceImpl: GeoapiDatasource = {
    geoApiParser: GeoApiParserImpl,

    findAll: async function (): Promise<City[]> {
        const url = `${geoApiConst.url}/communes`
        const geoCitiesResponse = await axios.get<GeoCity[]>(url, {
            headers: {
                Accept: "application/json",
            },
            params: {
                boost: "population",
            },
        })

        return await this.geoApiParser.parseMany(geoCitiesResponse.data)
    },

    findOneByCode: async function (code: string): Promise<CityWithCoordinates> {
        const url = `${geoApiConst.url}/communes/${code}`
        const geoCityResponse = await axios.get<GeoCityCoordinated | undefined>(url, {
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
        })

        if (geoCityResponse.data == null) {
            throw Error(`No city found with code : ${code}`)
        }

        return this.geoApiParser.parseOneWithCoordinates(geoCityResponse.data)
    },

    findManyByName: async function (name: string): Promise<CityWithCoordinates[]> {
        const url = `${geoApiConst.url}/communes`

        const geoCitiesResponse = await axios.get<GeoCityCoordinated[]>(url, {
            headers: {
                Accept: "application/json",
            },
            params: {
                fields: "centre",
                format: "json",
                geometry: "centre",
                boost: "population",
                limitQuery: "10",
                nom: name,
            },
        })

        if (geoCitiesResponse.data.length === 0) {
            throw Error(`No cities found with name : ${name}`)
        }

        return this.geoApiParser.parseManyWithCoordinates(geoCitiesResponse.data)
    },
}
