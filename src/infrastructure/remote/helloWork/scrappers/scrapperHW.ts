import JobOffer from "@App/domain/entities/jobOffer.entity"
import SourceSite from "@App/domain/enums/sourceData.enum"
import { Page } from "puppeteer"
import logger from "@App/core/tools/logger"
import hwConst from "../configs/hw.const"

export default interface ScrapperHW {
    getJobOffers: ({ page }: GetJobOffers) => Promise<JobOffer[]>
    getMaxPage: ({ page }: GetMaxPage) => Promise<number>
}

export const ScrapperHWImpl: ScrapperHW = {
    getJobOffers: async function ({ page }: GetJobOffers): Promise<JobOffer[]> {
        const jobOffers = new Array<JobOffer>()

        const jobRows = await page.$$("section > div > section > ul > li > div > div")

        console.clear()

        for (let i = 0; i < jobRows.length; i++) {
            const [imagesSelector, companySelector, hrefSelector, citySelector, createdSelector] = await Promise.all([
                jobRows[i].$$("img"),
                jobRows[i].$$("div > header > div > p"),
                jobRows[i].$$("a"),
                jobRows[i].$$('[data-cy="localisationCard"]'),
                jobRows[i].$$("div > div > div.tw-text-grey"),
            ])

            const image1 = await imagesSelector[0]?.evaluate((img) => img.getAttribute("src"))
            const image2 = await imagesSelector[1]?.evaluate((img) => img.getAttribute("src"))
            const companyName = await companySelector[0]?.evaluate((span) => span.textContent)
            const title = await hrefSelector[0]?.evaluate((a) => a.textContent?.trim())
            const sourceUrl = await hrefSelector[0]?.evaluate((a) => a.getAttribute("href"))
            const createdWhile = await createdSelector[0]?.evaluate((span) => span.textContent?.trim())
            const cityName = await citySelector[0]?.evaluate((div) => div.textContent?.trim())

            if (title && companyName && cityName && sourceUrl && createdWhile) {
                const jobOffer: JobOffer = {
                    sourceSite: SourceSite.hw,
                    sourceUrl: hwConst.baseUrl + sourceUrl,
                    title: title,
                    companyName: companyName,
                    cityName: cityName,
                    createdWhile: createdWhile,

                    companyLogoUrl: image2 ?? image1 ?? null,
                    imageUrl: image2 ? image1 ?? null : null,

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
