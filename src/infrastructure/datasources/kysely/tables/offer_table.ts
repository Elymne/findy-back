export default interface OfferTable {
    id: string
    title: string
    img_url: string | undefined

    company_id: string
    zone_id: string
    job_id: string

    tags: string[]

    created_at: Date
    updated_at: Date | undefined

    origin: number
    origin_url: string | undefined
}

// export function parseOfferTableToOffer(offerTable: OfferTable, companyTable: CompanyTable, zoneTable: ZoneTable, jobTable: JobTable): Offer {
//     return {
//         id: offerTable.id,
//         title: offerTable.title,
//         imgUrl: offerTable.img_url,

//         company: offerTable.company_id,
//         zone: offerTable.zone_id,
//         job: offerTable.job_id,

//         tags: offerTable.tags,

//         createdAt: offerTable.created_at,
//         updatedAt: offerTable.updated_at,

//         origin: offerTable.origin,
//         originUrl: offerTable.origin_url,
//     }
// }

// export function parseOfferToOfferTable(offer: Offer): OfferTable {
//     return {
//         id: offer.id,
//         title: offer.title,
//         img_url: offer.imgUrl,

//         company_id: offer.company.id!,
//         zone_id: offer.zone.id!,
//         job_id: offer.job.id!,

//         tags: offer.tags,

//         created_at: offer.createdAt,
//         updated_at: offer.updatedAt,

//         origin: offer.origin!,
//         origin_url: offer.originUrl,
//     }
// }
