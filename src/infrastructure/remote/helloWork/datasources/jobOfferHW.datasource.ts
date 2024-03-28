import JobOffer from "@App/domain/entities/jobOffer.entity"
import hwConst from "../configs/hw.const"
import { scrapHWPage } from "../scrappers/scrapHWPage"
import { PupetteerClient, TypeWebSiteStacker } from "@App/core/clients/pupetteer.client"

export interface JobOfferHWDatasource {
    findAllByQuery: ({ keyWords, cityName, page, nbElement, radius }: JobOfferHWQuery) => Promise<JobOffer[]>
}

export const JobOfferHWDatasourceImpl: JobOfferHWDatasource = {
    findAllByQuery: async function ({ keyWords, cityName, page, radius }: JobOfferHWQuery): Promise<JobOffer[]> {
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

export type JobOfferHWQuery = {
    keyWords: string
    cityName?: string
    radius?: number
    page?: number
    nbElement?: number
}
