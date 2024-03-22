import SourceSite from "../enums/sourceData.enum"

export default interface JobOffer {
    id?: string
    title: string
    imageUrl: string
    companyName: string
    companyLogoUrl: string
    cityName: string
    sourceUrl: string
    sourceData: SourceSite

    createdAt?: number
    updatedAt?: number
    createdWhile?: string
}
