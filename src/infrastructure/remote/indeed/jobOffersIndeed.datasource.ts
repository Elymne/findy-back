import { PupetteerClient, TypeWebSiteStacker } from "@App/core/clients/pupetteer.client"
import PageOffers from "@App/domain/entities/pageResult.entity"
import indeedConst from "./configs/indeed.configs"
import { scrapIndeedPage } from "./scrappers/scrapIndeedPage"

export interface PageOffersIndeedDatasource {
    findAllByQuery: ({ keyWords, cityName, page, nbElement, radius }: FindAllByQueryIndeedParams) => Promise<PageOffers>
}

export const PageOffersIndeedDatasourceImpl: PageOffersIndeedDatasource = {
    findAllByQuery: async function ({ keyWords, cityName, page, radius }: FindAllByQueryIndeedParams): Promise<PageOffers> {
        const url = "".concat(
            indeedConst.baseUrl,
            `/${indeedConst.jobPath}`,
            `?${indeedConst.keywords}=${keyWords}`,
            `&${indeedConst.page}=${page ? (page - 1) * 10 : 0}`,
            `&${indeedConst.radius}=${radius ?? 20}`,
            `&${indeedConst.contractType}=0kf%3Ajt(apprenticeship);`,
            cityName ? `&${indeedConst.cityName}=${cityName}` : ""
        )

        const newPage = await PupetteerClient.getInstance().createPage(TypeWebSiteStacker.indeed)
        await newPage.goto(url, { timeout: 10000, waitUntil: "networkidle0" })
        const result = await scrapIndeedPage(newPage)
        newPage.close()

        return result
    },
}

export type FindAllByQueryIndeedParams = {
    keyWords: string
    cityName?: string
    radius?: number
    page?: number
    nbElement?: number
}
