export interface GeoCity {
    centre: {
        type: string
        coordinates: number[] // lng and lat (this order).
    }
    nom: string
    code: string
}
