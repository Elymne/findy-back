import { PupetteerClient, TypeWebSiteStacker } from "@App/core/clients/pupetteer.client"
import PageOffers from "@App/domain/entities/pageResult.entity"
import hwConst from "./configs/hw.const"
import ScrapperHW, { ScrapperHWImpl } from "./scrappers/scrapperHW"

export default interface PageOffersHWDatasource {
    scrapperHW: ScrapperHW
    findAllByQuery: ({ keyWords, cityName, page, nbElement, radius }: FindAllByQueryHWParams) => Promise<PageOffers>
}

export const PageOffersHWDatasourceImpl: PageOffersHWDatasource = {
    scrapperHW: ScrapperHWImpl,
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

        const [jobOffers, maxPage] = await Promise.all([
            this.scrapperHW.getJobOffers({ page: newPage }),
            this.scrapperHW.getMaxPage({ page: newPage }),
        ])

        newPage.close()

        return {
            jobOffers: jobOffers,
            totalPagesNb: maxPage,
        }
    },
}

export type FindAllByQueryHWParams = {
    keyWords: string
    cityName?: string
    radius?: number
    page?: number
    nbElement?: number
}
