import { PupetteerClient, WebSite } from "@App/infrastructure/tools/clients/pupetteer.client"
import { hwConst } from "../configs/hw.const"
import { scrapHWPage } from "../scrappers/scrapHWPage"
import { JobOfferHW } from "../models/jobOfferHW"

type QueryParams = {
    keyWords: string
    cityName: string
    radius?: number
    page?: number
    nbElement?: number
}

export interface JobOfferHWDatasource {
    findAllByQuery: ({ keyWords, cityName, page, nbElement, radius }: QueryParams) => Promise<JobOfferHW[]>
}

export const JobOfferHWDatasourceImpl: JobOfferHWDatasource = {
    findAllByQuery: async function ({ keyWords, cityName, page, radius }: QueryParams): Promise<JobOfferHW[]> {
        const url = "".concat(
            hwConst.url,
            `?${hwConst.keywords}=${keyWords}`,
            `&${hwConst.cityName}=${cityName}`,
            `&${hwConst.page}=${page ?? 1}`,
            `&${hwConst.radius}=${radius ?? 20}`,
            `&${hwConst.contractType}=Alternance`
        )

        const newPage = await PupetteerClient.getInstance().createPage(WebSite.hw)
        await newPage.goto(url, { timeout: 10000, waitUntil: "networkidle0" })
        const result = await scrapHWPage(newPage)
        PupetteerClient.getInstance().closePage(newPage, WebSite.hw)

        return result
    },
}
