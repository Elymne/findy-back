import { Municipality } from "~/domain/entities/municipality.entity"
import { MunicipalityFT } from "../datasources/ftapi/models/municipalityFT"

export interface MunicipalityParser {
    parseFT: (source: MunicipalityFT[]) => Promise<Municipality[]>
}

export const MunicipalityParserImpl: MunicipalityParser = {
    parseFT: async function (source: MunicipalityFT[]): Promise<Municipality[]> {
        return source.map((elem) => {
            return {
                title: elem.libelle,
                code: elem.code,
            } as Municipality
        })
    },
}
