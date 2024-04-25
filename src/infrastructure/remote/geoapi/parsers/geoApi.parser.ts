import City, { CityWithCoordinates } from "@App/domain/entities/city.entity"
import GeoCity, { GeoCityCoordinated } from "../models/geoCity"

export default interface GeoApiParser {
    parseOne: (source: GeoCity) => Promise<City>
    parseMany: (sources: GeoCity[]) => Promise<City[]>
    parseOneWithCoordinates: (source: GeoCityCoordinated) => Promise<CityWithCoordinates>
    parseManyWithCoordinates: (sources: GeoCityCoordinated[]) => Promise<CityWithCoordinates[]>
}

export const GeoApiParserImpl: GeoApiParser = {
    parseOne: async function (source: GeoCity): Promise<City> {
        return {
            name: source.nom,
            code: source.code,
        }
    },

    parseMany: async function (sources: GeoCity[]): Promise<City[]> {
        const parsedSource = new Array<City>()
        for (let i = 0; i < sources.length; i++) {
            parsedSource.push({
                name: sources[i].nom,
                code: sources[i].code,
            })
        }
        return parsedSource
    },

    parseOneWithCoordinates: async function (source: GeoCityCoordinated): Promise<CityWithCoordinates> {
        return {
            name: source.nom,
            code: source.code,
            coordinates: {
                lng: source.centre.coordinates[0],
                lat: source.centre.coordinates[1],
            },
        }
    },

    parseManyWithCoordinates: async function (sources: GeoCityCoordinated[]): Promise<CityWithCoordinates[]> {
        const parsedSource = new Array<CityWithCoordinates>()
        for (let i = 0; i < sources.length; i++) {
            parsedSource.push({
                name: sources[i].nom,
                code: sources[i].code,
                coordinates: {
                    lng: sources[i].centre.coordinates[0],
                    lat: sources[i].centre.coordinates[1],
                },
            })
        }
        return parsedSource
    },
}
