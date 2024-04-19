import JobOffer from "@App/domain/entities/jobOffer.entity"
import SourceSite from "@App/domain/enums/sourceData.enum"
import wttjConst from "../configs/wttj.const"
import { Page } from "puppeteer"

export default interface ScrapperWTTJ {
    getJobOffers: ({ page }: GetJobOffersParams) => Promise<JobOffer[]>
    getJobOffersByRange: ({ page, range }: GetJobOffersRangeParams) => Promise<JobOffer[]>
    getMaxPage: ({ page }: GetMaxPageParams) => Promise<number>
}

export const ScrapperWTTJImpl: ScrapperWTTJ = {
    getJobOffers: async function ({ page }: GetJobOffersParams): Promise<JobOffer[]> {
        const jobOffers = new Array<JobOffer>()

        const jobRows = await page.$$('[data-testid="search-results-list-item-wrapper"]')

        for (let i = 0; i < jobRows.length - 1; i++) {
            const [imageSelectors, h4selectors, spanSelectors, aSelector] = await Promise.all([
                jobRows[i].$$("img"),
                jobRows[i].$$("h4"),
                jobRows[i].$$("span"),
                jobRows[i].$$("a"),
            ])

            const [imageUrl, companyLogoUrl, title, companyName, cityName, sourceUrl, createdWhile] = await Promise.all([
                imageSelectors[0]?.evaluate((img) => img.getAttribute("src")),
                imageSelectors[1]?.evaluate((img) => img.getAttribute("src")),
                h4selectors[0]?.evaluate((h4) => h4.textContent),
                spanSelectors[0]?.evaluate((span) => span.textContent),
                spanSelectors[2]?.evaluate((span) => span.textContent),
                aSelector[0]?.evaluate((span) => span.getAttribute("href")),
                spanSelectors[spanSelectors.length - 1]?.evaluate((span) => span.textContent),
            ])

            if (title && companyName && cityName && sourceUrl && createdWhile) {
                const jobOffer: JobOffer = {
                    sourceSite: SourceSite.wttj,
                    sourceUrl: wttjConst.basurl + sourceUrl,
                    title: title,
                    companyName: companyName,
                    cityName: cityName,
                    createdWhile: createdWhile,

                    companyLogoUrl: companyLogoUrl ?? "http://localhost:3000/static/images/logo_placeholder.png",
                    imageUrl: imageUrl ?? "http://localhost:3000/static/images/placeholder.jpg",

                    id: undefined,
                    createdAt: undefined,
                    updatedAt: undefined,
                }
                jobOffers.push(jobOffer)
            }
        }

        return jobOffers
    },

    getJobOffersByRange: async function ({ page, range }: GetJobOffersRangeParams): Promise<JobOffer[]> {
        const splitedString = range?.split("-")

        if (splitedString?.length != 2) {
            throw Error("Range should be correctly formed")
        }

        if (isNaN(+splitedString[0] && +splitedString[1])) {
            throw Error("Range should be correctly formed")
        }

        if (+splitedString[0] < 1) {
            throw Error("Range should be correctly formed")
        }

        if (+splitedString[0] > +splitedString[1]) {
            throw Error("Range should be correctly formed")
        }

        const jobOffers = new Array<JobOffer>()

        const jobRows = await page.$$('[data-testid="search-results-list-item-wrapper"]')

        for (let i = +splitedString[0] - 1; i < +splitedString[1] - 1; i++) {
            const [imageSelectors, h4selectors, spanSelectors, aSelector] = await Promise.all([
                jobRows[i].$$("img"),
                jobRows[i].$$("h4"),
                jobRows[i].$$("span"),
                jobRows[i].$$("a"),
            ])

            const [imageUrl, companyLogoUrl, title, companyName, cityName, sourceUrl, createdWhile] = await Promise.all([
                imageSelectors[0]?.evaluate((img) => img.getAttribute("src")),
                imageSelectors[1]?.evaluate((img) => img.getAttribute("src")),
                h4selectors[0]?.evaluate((h4) => h4.textContent),
                spanSelectors[0]?.evaluate((span) => span.textContent),
                spanSelectors[2]?.evaluate((span) => span.textContent),
                aSelector[0]?.evaluate((span) => span.getAttribute("href")),
                spanSelectors[spanSelectors.length - 1]?.evaluate((span) => span.textContent),
            ])

            if (title && companyName && cityName && sourceUrl && createdWhile) {
                const jobOffer: JobOffer = {
                    sourceSite: SourceSite.wttj,
                    sourceUrl: wttjConst.basurl + sourceUrl,
                    title: title,
                    companyName: companyName,
                    cityName: cityName,
                    createdWhile: createdWhile,

                    companyLogoUrl: companyLogoUrl ?? "http://localhost:3000/static/images/logo_placeholder.png",
                    imageUrl: imageUrl ?? "http://localhost:3000/static/images/placeholder.jpg",

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
        const pageRows = await page.$$('nav[aria-label="Pagination"] > ul > li')

        const totalPages = await pageRows[pageRows.length - 2]?.$eval("a", (a) => a.textContent)

        if (!totalPages) {
            return 1
        }

        return +totalPages
    },
}

type GetJobOffersParams = {
    page: Page
}

type GetJobOffersRangeParams = {
    page: Page
    range: string
}

type GetMaxPageParams = {
    page: Page
}
