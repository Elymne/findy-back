import { CityFT } from "../models/municipalityFT"

export interface CityFTService {
    filter(sources: CityFT[]): CityFT[]
}

export const CityFTServiceImpl: CityFTService = {
    filter: function (sources: CityFT[]): CityFT[] {
        const result: CityFT[] = []
        const map = new Map<string, boolean>()
        for (let elem of sources) {
            if (elem.libelle.slice(0, 5).toUpperCase() === "PARIS") {
                elem.libelle = "PARIS"
            }

            if (!map.has(elem.libelle)) {
                map.set(elem.libelle, true)
                result.push({
                    code: elem.code,
                    codeDepartement: elem.codeDepartement,
                    codePostal: elem.codePostal,
                    libelle: elem.libelle,
                })
            }
        }
        return result
    },
}
