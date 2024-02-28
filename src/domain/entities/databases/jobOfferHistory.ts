export interface JobOfferHistory {
    id: string
    source_id?: string
    source_url?: string
    source: JobOfferSource
    is_banned: boolean
}

export enum JobOfferSource {
    ftapi = "ftapi",
    wttj = "wttj",
}
