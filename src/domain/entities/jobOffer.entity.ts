import { SourceSite } from "../enums/sourceData.enum"

export interface JobOffer {
    id?: string
    title: string
    image_url: string
    company_name: string
    company_logo_url: string
    city_name: string
    source_url: string
    source_data: SourceSite

    created_at?: number
    updated_at?: number
    created_while?: string
}
