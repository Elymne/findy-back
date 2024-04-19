export default interface City {
    name: string
    code: string
}

export interface CityWithCoordinates extends City {
    coordinates: {
        lng: number
        lat: number
    }
}
