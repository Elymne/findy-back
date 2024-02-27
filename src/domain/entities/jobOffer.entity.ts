/**
 *
 */
export interface JobOffer {
    id?: string
    title: string
    imageUrl: string
    companyName: string
    companyLogoUrl: string
    cityName: string
    sourceUrl: string

    createdAt?: number
    updatedAt?: number
    createdWhile?: string
}
