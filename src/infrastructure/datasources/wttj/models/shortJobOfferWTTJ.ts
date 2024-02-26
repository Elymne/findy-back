import { UUID } from "crypto"

export interface ShortJobOfferWTTJ {
    id?: UUID
    title: string
    accessUrl: string
    imagUrl: string
    logoUrl: string
    companyName: string
}
