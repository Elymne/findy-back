import SourceSite from "../enums/sourceData.enum"

export default interface JobOfferHistory {
    id: string
    source: string
    source_type: SourceSite
    is_banned: boolean
}
