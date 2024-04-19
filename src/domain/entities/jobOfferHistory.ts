import SourceSite from "../enums/sourceData.enum"

export default interface JobOfferHistory {
    id: string
    source: string
    sourceSite: SourceSite
    isBanned: boolean
}
