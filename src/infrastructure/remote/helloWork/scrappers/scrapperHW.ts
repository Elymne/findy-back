import JobOffer from "@App/domain/entities/jobOffer.entity"
import SourceSite from "@App/domain/enums/sourceData.enum"
import indeedConst from "../../indeed/configs/indeed.configs"
import { Page } from "puppeteer"
import logger from "@App/core/tools/logger"

export default interface ScrapperHW {
    getJobOffers: ({ page }: GetJobOffers) => Promise<JobOffer[]>
    getMaxPage: ({ page }: GetMaxPage) => Promise<number>
}

export const ScrapperHWImpl: ScrapperHW = {
    getJobOffers: async function ({ page }: GetJobOffers): Promise<JobOffer[]> {
        const jobOffers = new Array<JobOffer>()

        const jobRows = await page.$$("section.serp > div > section > ul.crushed > li")

        for (let i = 0; i < jobRows.length; i++) {
            const [imagesSelector, companySelector, hrefSelector, tagsSelector, createdSelector] = await Promise.all([
                jobRows[i].$$("img"),
                jobRows[i].$$('[data-cy="companyName"] > span'),
                jobRows[i].$$("a"),
                jobRows[i].$$("#infos"),
                jobRows[i].$$('[data-cy="publishDate"]'),
            ])

            const image1 = await imagesSelector[0]?.evaluate((img) => img.getAttribute("src"))
            const image2 = await imagesSelector[1]?.evaluate((img) => img.getAttribute("src"))
            const companyName = await companySelector[0]?.evaluate((span) => span.textContent)
            const title = await hrefSelector[0]?.evaluate((a) => a.textContent?.trim())
            const sourceUrl = await hrefSelector[0]?.evaluate((a) => a.getAttribute("href"))
            const createdWhile = await createdSelector[0]?.evaluate((span) => span.textContent?.trim())

            let cityName: string | null | undefined = undefined
            for (let j = 0; j < tagsSelector.length; j++) {
                const spanSelector = await tagsSelector[j].$("span > span")
                if (spanSelector) {
                    cityName = await spanSelector.evaluate((span) => span.textContent)
                }
            }

            if (title && companyName && cityName && sourceUrl && createdWhile) {
                const jobOffer: JobOffer = {
                    sourceSite: SourceSite.hw,
                    sourceUrl: indeedConst.baseUrl + sourceUrl,
                    title: title,
                    companyName: companyName,
                    cityName: cityName,
                    createdWhile: createdWhile,

                    companyLogoUrl: image2 ?? image1 ?? "http://localhost:3000/static/images/logo_placeholder.png",
                    imageUrl: image2
                        ? image1 ?? "http://localhost:3000/static/images/placeholder.jpg"
                        : "http://localhost:3000/static/images/placeholder.jpg",

                    id: undefined,
                    createdAt: undefined,
                    updatedAt: undefined,
                }
                jobOffers.push(jobOffer)
            }
        }

        return jobOffers
    },

    getMaxPage: async function ({ page }: GetMaxPage): Promise<number> {
        const paginationSelector = await page.$$("#pagin > div > div > div > div > ul > li")

        if (paginationSelector.length == 0) {
            return 1
        }

        const lastPageIfLast = await paginationSelector[paginationSelector.length - 1]?.$eval("label", (label) => {
            return label.textContent
        })

        const lastPage = await paginationSelector[paginationSelector.length - 2]?.$eval("label", (label) => {
            return label.textContent
        })

        if (lastPage == null) {
            logger.warn("[ScrapperHWImpl]", [
                "getMaxPage function get the list of pagination element but can't reach the last element.",
                "You should check that each element are LABEL html element",
            ])
            return 1
        }

        if (lastPageIfLast != null && +lastPageIfLast == 0) {
            return +lastPage
        }

        if (lastPageIfLast == null) {
            logger.warn("[ScrapperHWImpl]", [
                "getMaxPage function get the list of pagination element but can't reach the last element.",
                "You should check that each element are LABEL html element",
            ])
            return 1
        }

        return +lastPageIfLast
    },
}

type GetJobOffers = {
    page: Page
}

type GetMaxPage = {
    page: Page
}
