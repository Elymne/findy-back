import Offer from "@App/domain/models/clean/Offer.model"
import OfferLocalRepository from "@App/domain/repositories/OfferLocal.repository"
import KyselyDatabase from "./db/KyselyDatabase"
import { OfferCreate } from "./tables/offer_table"

export default class OfferLocalDatasource implements OfferLocalRepository {
    async findOne(id: string): Promise<Offer | undefined> {
        const result = await KyselyDatabase.get.connec
            .selectFrom("offer")
            .innerJoin("zone", "zone.id", "offer.zone_id")
            .innerJoin("company", "company.id", "offer.company_id")
            .innerJoin("job", "job.id", "offer.job_id")
            .select([
                "offer.id as offer_id",
                "offer.title as offer_title",
                "offer.img_url as offer_img_url",
                "offer.tags as offer_tags",
                "offer.created_at as offer_created_at",
                "offer.updated_at as offer_updated_at",
                "offer.origin as offer_origin",
                "offer.origin_url as offer_origin_url",

                "zone.id as zone_id",
                "zone.name as zone_name",
                "zone.lat as zone_lat",
                "zone.lng as zone_lng",

                "company.id as company_id",
                "company.name as company_name",
                "company.description as company_description",
                "company.logo_url as company_logo_url",
                "company.url as company_url",

                "job.id as job_id",
                "job.title as job_title",
            ])
            .where("id", "=", id)
            .executeTakeFirst()

        if (!result) {
            return undefined
        }

        return {
            id: result.offer_id,
            title: result.offer_title,
            imgUrl: result.offer_img_url,

            tags: result.offer_tags,

            company: {
                id: result.company_id,
                name: result.company_name,
                description: result.company_description,
                logoUrl: result.company_logo_url,
                url: result.company_url,
            },

            job: {
                id: result.job_id,
                title: result.job_title,
            },

            zone: {
                id: result.zone_id,
                name: result.zone_name,
                lat: result.zone_lat,
                lng: result.zone_lng,
            },

            createdAt: result.offer_created_at,
            updatedAt: result.offer_updated_at,
            origin: result.offer_origin,
            originUrl: result.offer_origin_url,
        }
    }

    async findMany(params: { keyWords?: string; codezone?: string; codejob?: string; distance?: number; range: string }): Promise<Offer[]> {
        const rangeSplit = params.range.split("-")
        if (rangeSplit.length != 2) {
            throw `Error : the range is not setup correctly. Current range : ${params.range}`
        }

        const start = parseInt(rangeSplit[0])
        const end = parseInt(rangeSplit[1])
        if (start || end) {
            throw `Error : the range is not setup correctly. Current range : ${params.range}`
        }

        let query = KyselyDatabase.get.connec
            .selectFrom("offer")
            .innerJoin("zone", "zone.id", "offer.zone_id")
            .innerJoin("company", "company.id", "offer.company_id")
            .innerJoin("job", "job.id", "offer.job_id")
            .select([
                "offer.id as offer_id",
                "offer.title as offer_title",
                "offer.img_url as offer_img_url",
                "offer.tags as offer_tags",
                "offer.created_at as offer_created_at",
                "offer.updated_at as offer_updated_at",
                "offer.origin as offer_origin",
                "offer.origin_url as offer_origin_url",

                "zone.id as zone_id",
                "zone.name as zone_name",
                "zone.lat as zone_lat",
                "zone.lng as zone_lng",

                "company.id as company_id",
                "company.name as company_name",
                "company.description as company_description",
                "company.logo_url as company_logo_url",
                "company.url as company_url",

                "job.id as job_id",
                "job.title as job_title",
            ])
        query = query.offset(start)
        query = query.limit(end - start)

        const results = await query.execute()
        return results.map((result) => {
            return {
                id: result.offer_id,
                title: result.offer_title,
                imgUrl: result.offer_img_url,

                tags: result.offer_tags,

                company: {
                    id: result.company_id,
                    name: result.company_name,
                    description: result.company_description,
                    logoUrl: result.company_logo_url,
                    url: result.company_url,
                },

                job: {
                    id: result.job_id,
                    title: result.job_title,
                },

                zone: {
                    id: result.zone_id,
                    name: result.zone_name,
                    lat: result.zone_lat,
                    lng: result.zone_lng,
                },

                createdAt: result.offer_created_at,
                updatedAt: result.offer_updated_at,
                origin: result.offer_origin,
                originUrl: result.offer_origin_url,
            }
        })
    }

    async createMany(offers: Offer[]): Promise<void> {
        const offersCreate: OfferCreate[] = offers.map((offer) => {
            return {
                id: offer.id,
                title: offer.title,
                img_url: offer.imgUrl,
                tags: offer.tags,
                zone_id: offer.zone.id,
                company_id: offer.company.id,
                job_id: offer.job.id,
                created_at: offer.createdAt,
                updated_at: offer.updatedAt,
                origin: offer.origin,
                origin_url: offer.originUrl,
            }
        })
        await KyselyDatabase.get.connec.insertInto("offer").values(offersCreate).execute()
    }

    async createOne(offer: Offer): Promise<void> {
        const offerCreate: OfferCreate = {
            id: offer.id,
            title: offer.title,
            img_url: offer.imgUrl,
            tags: offer.tags,
            zone_id: offer.zone.id,
            company_id: offer.company.id,
            job_id: offer.job.id,
            created_at: offer.createdAt,
            updated_at: offer.updatedAt,
            origin: offer.origin,
            origin_url: offer.originUrl,
        }
        await KyselyDatabase.get.connec.insertInto("offer").values(offerCreate).execute()
    }

    async deleteMany(ids: string[]): Promise<number> {
        console.log(ids)
        throw new Error("Method not implemented.")
    }

    async getLastTimeUpdate(): Promise<number | undefined> {
        throw new Error("Method not implemented.")
    }
}
