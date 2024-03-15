import { SourceSite } from "../enums/sourceData.enum"

export interface KnownJobOffer {
    id: string
    source_id?: string
    source_url?: string
    source: SourceSite
    is_banned: boolean
}
