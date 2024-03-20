import { City } from "@App/domain/entities/city.entity"

export interface CityService {
    filter: (sources: City[]) => Promise<City[]>
}

export const CityServiceImpl: CityService = {
    /**
     * Clusterfuck function
     * TODO : Optimiser cette chiasse même si c'est mis en cache, tocard de fils de pute de sacha djurdjevic.
     */
    filter: async function (sources: City[]): Promise<City[]> {
        console.clear()

        const result = []
        const map = new Map<string, boolean>()
        for (const elem of sources) {
            if (!map.has(elem.code)) {
                map.set(elem.code, true)
                result.push({
                    code: elem.code,
                    name: elem.name,
                })
            }
        }

        const result2 = []
        let isParisFucked: boolean = false
        for (const elem of sources) {
            if (elem.name.slice(0, 5).toLowerCase() == "paris") {
                if (!isParisFucked) {
                    result2.push({
                        code: elem.code,
                        name: elem.name.slice(0, 5),
                    })
                    isParisFucked = true
                }
            } else {
                result2.push({
                    code: elem.code,
                    name: elem.name,
                })
            }
        }

        return result2
    },
}
