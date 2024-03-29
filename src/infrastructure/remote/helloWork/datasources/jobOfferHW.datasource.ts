import JobOffer from "@App/domain/entities/jobOffer.entity"
import hwConst from "../configs/hw.const"
import { scrapHWPage } from "../scrappers/scrapHWPage"
import { PupetteerClient, TypeWebSiteStacker } from "@App/core/clients/pupetteer.client"
import PageOffers from "@App/domain/entities/pageResult.entity"

export interface PageOffersHWDatasource {
    findAllByQuery: ({ keyWords, cityName, page, nbElement, radius }: FindAllByQueryHWParams) => Promise<PageOffers>
}

export const PageOffersHWDatasourceImpl: PageOffersHWDatasource = {
    findAllByQuery: async function ({ keyWords, cityName, page, radius }: FindAllByQueryHWParams): Promise<PageOffers> {
        const url = "".concat(
            hwConst.baseUrl,
            `/${hwConst.jobPath}`,
            `?${hwConst.keywords}=${keyWords}`,
            `&${hwConst.page}=${page ?? 1}`,
            `&${hwConst.radius}=${radius ?? 20}`,
            `&${hwConst.contractType}=Alternance`,
            cityName ? `&${hwConst.cityName}=${cityName}` : ""
        )

        const newPage = await PupetteerClient.getInstance().createPage(TypeWebSiteStacker.hw)
        await newPage.goto(url, { timeout: 10000, waitUntil: "networkidle0" })
        const result = await scrapHWPage(newPage)
        newPage.close()

        return result
    },
}

export type FindAllByQueryHWParams = {
    keyWords: string
    cityName?: string
    radius?: number
    page?: number
    nbElement?: number
}
