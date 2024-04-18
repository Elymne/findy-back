import SourceSite from "../enums/sourceData.enum"

export default interface JobOffer {
    id?: string

    title: string
    companyName: string
    cityName: string
    sourceUrl: string
    sourceSite: SourceSite

    companyLogoUrl: string
    imageUrl: string

    createdAt?: number
    updatedAt?: number
    createdWhile?: string
}
