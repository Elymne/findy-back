import City, { CityDetailed } from "@App/domain/entities/city.entity"
import GeoCity, { GeoCityCoordinated } from "../models/geoCity"

export interface GeoApiParser {
    parse: (sources: GeoCity[]) => Promise<City[]>
    parseOne: (source: GeoCityCoordinated) => Promise<CityDetailed>
}

export const GeoApiParserImpl: GeoApiParser = {
    parse: async function (sources: GeoCity[]): Promise<City[]> {
        const parsedSource = new Array<City>()
        for (let i = 0; i < sources.length; i++) {
            parsedSource.push({
                name: sources[i].nom,
                code: sources[i].code,
            })
        }
        return parsedSource
    },

    parseOne: async function (source: GeoCityCoordinated): Promise<CityDetailed> {
        return {
            name: source.nom,
            code: source.code,
            coordinates: {
                lng: source.centre.coordinates[0],
                lat: source.centre.coordinates[1],
            },
        }
    },
}
