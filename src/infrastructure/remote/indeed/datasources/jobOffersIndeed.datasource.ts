import JobOffer from "@App/domain/entities/jobOffer.entity"
import { PupetteerClient, TypeWebSiteStacker } from "@App/core/clients/pupetteer.client"
import indeedConst from "../configs/indeed.configs"
import { scrapIndeedPage } from "../scrappers/scrapIndeedPage"
import { wait } from "@App/core/tools/utils"

export interface JobOfferIndeedDatasource {
    findAllByQuery: ({ keyWords, cityName, page, nbElement, radius }: JobOfferIndeedQuery) => Promise<JobOffer[]>
}

export const JobOfferIndeedDatasourceImpl: JobOfferIndeedDatasource = {
    findAllByQuery: async function ({ keyWords, cityName, page, radius }: JobOfferIndeedQuery): Promise<JobOffer[]> {
        const url = "".concat(
            indeedConst.baseUrl,
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

export type JobOfferIndeedQuery = {
    keyWords: string
    cityName?: string
    radius?: number
    page?: number
    nbElement?: number
}
