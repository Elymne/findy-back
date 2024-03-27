export default interface City {
    name: string
    code: string
}

export interface CityDetailed extends City {
    coordinates: {
        lng: number
        lat: number
    }
}
