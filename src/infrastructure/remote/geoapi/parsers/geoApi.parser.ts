import City from "@App/domain/entities/city.entity"
import GeoCity from "../models/geoCity"

export interface GeoApiParser {
    parse: (sources: GeoCity[]) => Promise<City[]>
    parseOne: (source: GeoCity) => Promise<City>
}

export const GeoApiParserImpl: GeoApiParser = {
    parse: async function (sources: GeoCity[]): Promise<City[]> {
        const parsedSource = new Array<City>(sources.length)
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

    parseOne: async function (source: GeoCity): Promise<City> {
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
