import { PupetteerClient, WebSite } from "@App/infrastructure/tools/clients/pupetteer.client"
import { JobOfferWTTJ } from "../models/JobOfferWTTJ"
import { scrapWTTJPage } from "../scrappers/scrapWTTJPage"
import { wttjConst } from "../configs/wttj.const"

type QueryParams = {
    keyWords: string
    lat?: number
    lng?: number
    page?: number
    radius?: number
    nbElement?: number
}

export interface JobOfferWTTJDatasource {
    findAllByQuery: ({ keyWords, lat, lng, page, radius, nbElement }: QueryParams) => Promise<JobOfferWTTJ[]>
}

export const JobOfferWTTJDatasourceImpl: JobOfferWTTJDatasource = {
    findAllByQuery: async function ({ keyWords, lat, lng, page, radius, nbElement }: QueryParams): Promise<JobOfferWTTJ[]> {
        const url: string = "".concat(
            wttjConst.url,
            `?${wttjConst.country}=FR`,
            `&${wttjConst.contractType}=apprenticeship`,
            `&${wttjConst.page}=${page ?? 1}`,
            `&${wttjConst.radius}=${radius ?? 20}`,
            `&${wttjConst.keywords}=${keyWords}`,

            lat && lng ? `&${wttjConst.aroundLatLng}=${lat},${lng}` : ""
        )

        const newPage = await PupetteerClient.getInstance().createPage(WebSite.wttj)

        await newPage.goto(url, { timeout: 10000, waitUntil: "networkidle0" })

        const result = await scrapWTTJPage(newPage, { nb: nbElement })

        PupetteerClient.getInstance().closePage(newPage, WebSite.wttj)

        return result
    },
}
