import JobOffer from "@App/domain/entities/jobOffer.entity"
import wttjConst from "../configs/wttj.const"
import { scrapWTTJPage } from "../scrappers/scrapWTTJPage"
import { PupetteerClient, WebSite } from "@App/core/clients/pupetteer.client"

export interface JobOfferWTTJDatasource {
    findAllByQuery: ({ keyWords, lat, lng, page, radius, nbElement }: JobOfferWTTJQuery) => Promise<JobOffer[]>
}

export const JobOfferWTTJDatasourceImpl: JobOfferWTTJDatasource = {
    findAllByQuery: async function ({ keyWords, lat, lng, page, radius, nbElement }: JobOfferWTTJQuery): Promise<JobOffer[]> {
        const url: string = "".concat(
            wttjConst.url,
            `?${wttjConst.country}=FR`,
            `&${wttjConst.contractType}=apprenticeship`,
            `&${wttjConst.keywords}=${keyWords}`,
            `&${wttjConst.page}=${page ?? 1}`,
            `&${wttjConst.radius}=${radius ?? 20}`,
            lat && lng ? `&${wttjConst.aroundLatLng}=${lat},${lng}` : ""
        )

        const newPage = await PupetteerClient.getInstance().createPage(WebSite.wttj)
        await newPage.goto(url, { timeout: 10000, waitUntil: "networkidle0" })

        const result = await scrapWTTJPage(newPage, nbElement)

        PupetteerClient.getInstance().closePage(newPage, WebSite.wttj)

        return result
    },
}

export type JobOfferWTTJQuery = {
    keyWords: string
    lat?: number
    lng?: number
    page?: number
    radius?: number
    nbElement?: number
}