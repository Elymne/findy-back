export default interface GeoCity {
    nom: string
    code: string
}

export interface GeoCityCoordinated extends GeoCity {
    centre: {
        type: string
        coordinates: number[]
    }
}
