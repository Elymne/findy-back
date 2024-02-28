import { City } from "~/domain/entities/city.entity"
import { CityFT } from "../datasources/ftapi/models/municipalityFT"

export interface MunicipalityParser {
    parseFT: (source: CityFT[]) => Promise<City[]>
}

export const MunicipalityParserImpl: MunicipalityParser = {
    parseFT: async function (source: CityFT[]): Promise<City[]> {
        return source.map((elem) => {
            return {
                name: elem.libelle,
                code: elem.code,
            } as City
        })
    },
}
