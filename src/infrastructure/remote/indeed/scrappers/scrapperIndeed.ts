import JobOffer from "@App/domain/entities/jobOffer.entity"
import SourceSite from "@App/domain/enums/sourceData.enum"
import indeedConst from "../configs/indeed.configs"
import { Page } from "puppeteer"

export default interface ScapperIndeed {
    getJobOffers: ({ page }: GetJobOffersParams) => Promise<JobOffer[]>
    getMaxPage: ({ page }: GetMaxPageParams) => Promise<number>
}

export const ScapperIndeedImpl: ScapperIndeed = {
    getJobOffers: async function ({ page }: GetJobOffersParams): Promise<JobOffer[]> {
        const rows = await page.$$("#mosaic-provider-jobcards > ul > li")
        const jobOffers = new Array<JobOffer>()

        for (let i = 0; i < rows.length; i++) {
            const [imagesSelector, hrefSelector, companySelector, citySelector, createdWhileSelector] = await Promise.all([
                rows[i].$("img"),
                rows[i].$("a"),
                rows[i].$('[data-testid="company-name"]'),
                rows[i].$('[data-testid="text-location"]'),
                rows[i].$('[data-testid="myJobsStateDate"]'),
            ])

            const companyLogoUrl = await imagesSelector?.evaluate((img) => img.getAttribute("src"))
            const sourceUrl = await hrefSelector?.evaluate((a) => a.getAttribute("href"))
            const title = await hrefSelector?.evaluate((a) => a.textContent)
            const companyName = await companySelector?.evaluate((span) => span.textContent)
            const cityName = await citySelector?.evaluate((div) => div.textContent)
            const createdWhile = await createdWhileSelector?.evaluate((span) => span.textContent)

            if (title && companyName && cityName && sourceUrl && createdWhile) {
                const jobOffer: JobOffer = {
                    sourceData: SourceSite.indeed,
                    sourceUrl: indeedConst.baseUrl + sourceUrl,
                    title: title,
                    companyName: companyName,
                    cityName: cityName,
                    createdWhile: createdWhile,

                    companyLogoUrl: companyLogoUrl ?? "http://localhost:3000/static/images/logo_placeholder.png",
                    imageUrl: "http://localhost:3000/static/images/placeholder.jpg",

                    id: undefined,
                    createdAt: undefined,
                    updatedAt: undefined,
                }
                jobOffers.push(jobOffer)
            }
        }

        return jobOffers
    },

    getMaxPage: async function ({ page }: GetMaxPageParams): Promise<number> {
        const paginationSelector = await page.$$('[role="navigation"] > ul > li')

        const lastPage = await paginationSelector[paginationSelector.length - 1].$eval("a", (a) => {
            return a.textContent
        })

        if (!lastPage) {
            return 1
        }

        return +lastPage
    },
}

type GetJobOffersParams = {
    page: Page
}

type GetMaxPageParams = {
    page: Page
}
