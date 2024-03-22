import { City } from "@App/domain/entities/city.entity"
import { GeoCity } from "../models/geoCity"

export interface JobOfferWTTJParser {
    parse: (source: GeoCity[]) => Promise<City[]>
}

export const JobOfferWTTJParserImpl: JobOfferWTTJParser = {
    parse: async function (source: GeoCity[]): Promise<City[]> {
        const parsedSource: City[] = []
        for (let i = 0; i < source.length; i++) {
            parsedSource.push({
                name: source[i].nom,
                code: source[i].code,
                coordinates: {
                    lng: source[i].centre.coordinates[0],
                    lat: source[i].centre.coordinates[0],
                },
            })
        }
        return parsedSource
    },
}
