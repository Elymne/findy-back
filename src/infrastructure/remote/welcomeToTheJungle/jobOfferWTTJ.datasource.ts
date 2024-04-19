import PupetteerClient from "@App/core/clients/pupetteer.client"
import PageOffers from "@App/domain/entities/pageResult.entity"
import wttjConst from "./configs/wttj.const"
import ScrapperWTTJ, { ScrapperWTTJImpl } from "./scrappers/scrapperWTTJ"

export default interface PageOffersWTTJDatasource {
    scrapperWTTJ: ScrapperWTTJ
    pupetteerClient: PupetteerClient
    findAllByQuery: ({ keyWords, lat, lng, page, radius }: FindAllByQueryWTTJParams) => Promise<PageOffers>
    findSample: ({ keyWords }: FindSampleWTTJParams) => Promise<PageOffers>
}

export const PageOffersWTTJDatasourceImpl: PageOffersWTTJDatasource = {
    scrapperWTTJ: ScrapperWTTJImpl,
    pupetteerClient: PupetteerClient.getInstance(),

    findAllByQuery: async function ({ keyWords, lat, lng, radius, page }: FindAllByQueryWTTJParams): Promise<PageOffers> {
        const url: string = "".concat(
            wttjConst.basurl,
            `/${wttjConst.jobPath}`,
            `?${wttjConst.country}=FR`,
            `&${wttjConst.contractType}=apprenticeship`,
            `&${wttjConst.keywords}=${keyWords}`,
            `&${wttjConst.page}=${page ?? 1}`,
            `&${wttjConst.radius}=${radius ?? 20}`,
            lat && lng ? `&${wttjConst.aroundLatLng}=${lat},${lng}` : ""
        )

        const newPage = await PupetteerClient.getInstance().createPage()
        await newPage.goto(url, { timeout: 10000, waitUntil: "networkidle0" })

        const [jobOffers, maxPage] = await Promise.all([
            this.scrapperWTTJ.getJobOffers({ page: newPage }),
            this.scrapperWTTJ.getMaxPage({ page: newPage }),
        ])

        newPage.close()

        return {
            jobOffers: jobOffers,
            totalPagesNb: maxPage,
        }
    },

    findSample: async function ({ keyWords }: FindSampleWTTJParams): Promise<PageOffers> {
        const url: string = "".concat(
            wttjConst.basurl,
            `/${wttjConst.jobPath}`,
            `?${wttjConst.country}=FR`,
            `&${wttjConst.contractType}=apprenticeship`,
            `&${wttjConst.keywords}=${keyWords}`,
            `&${wttjConst.page}=${1}`
        )

        const newPage = await this.pupetteerClient.createPage()
        await newPage.goto(url, { timeout: 10000, waitUntil: "networkidle0" })

        const [jobOffers, maxPage] = await Promise.all([
            this.scrapperWTTJ.getJobOffersByRange({ page: newPage, range: "1-6" }),
            this.scrapperWTTJ.getMaxPage({ page: newPage }),
        ])

        newPage.close()

        return {
            jobOffers: jobOffers,
            totalPagesNb: maxPage,
        }
    },
}

export type FindAllByQueryWTTJParams = {
    keyWords: string
    lat?: number
    lng?: number
    radius?: number
    page?: number
}

export type FindSampleWTTJParams = {
    keyWords: string
}
