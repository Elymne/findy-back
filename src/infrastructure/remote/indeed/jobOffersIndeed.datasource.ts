import PupetteerClient from "@App/core/clients/pupetteer.client"
import PageOffers from "@App/domain/entities/pageResult.entity"
import indeedConst from "./configs/indeed.configs"
import ScapperIndeed, { ScapperIndeedImpl } from "./scrappers/scrapperIndeed"

export default interface PageOffersIndeedDatasource {
    scapperIndeed: ScapperIndeed
    pupetteerClient: PupetteerClient
    findAllByQuery: ({ keyWords, cityName, page, nbElement, radius }: FindAllByQueryIndeedParams) => Promise<PageOffers>
}

export const PageOffersIndeedDatasourceImpl: PageOffersIndeedDatasource = {
    scapperIndeed: ScapperIndeedImpl,
    pupetteerClient: PupetteerClient.getInstance(),

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

        console.log(url)

        const newPage = await this.pupetteerClient.createPage()
        await newPage.goto(url, { timeout: 10000, waitUntil: "networkidle0" })

        const [jobOffers, maxPage] = await Promise.all([
            this.scapperIndeed.getJobOffers({ page: newPage }),
            this.scapperIndeed.getMaxPage({ page: newPage }),
        ])

        newPage.close()

        return {
            jobOffers: jobOffers,
            totalPagesNb: maxPage,
        }
    },
}

export type FindAllByQueryIndeedParams = {
    keyWords: string
    cityName?: string
    radius?: number
    page?: number
    nbElement?: number
}
