import JobOffer from "@App/domain/entities/jobOffer.entity"
import SourceSite from "@App/domain/enums/sourceData.enum"
import { Page } from "puppeteer"
import wttjConst from "../configs/wttj.const"
import PageOffers from "@App/domain/entities/pageResult.entity"

export async function scrapWTTJPage(page: Page, nbMax?: number): Promise<PageOffers> {
    const jobOffers = new Array<JobOffer>()

    const [jobRows, pageRows] = await Promise.all([
        page.$$('[data-testid="search-results-list-item-wrapper"]'),
        page.$$('nav[aria-label="Pagination"] > ul > li'),
    ])

    const maxJobs = nbMax && nbMax <= jobRows.length ? nbMax : jobRows.length

    for (let i = 0; i < maxJobs; i++) {
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
                sourceData: SourceSite.wttj,
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

    const totalPages = await pageRows[pageRows.length - 2]?.$eval("a", (a) => a.textContent)
    const totalPagesAsNumber = parseInt(totalPages ?? "1")

    const pageOffers: PageOffers = {
        totalPagesNb: totalPagesAsNumber,
        jobOffers: jobOffers,
    }

    return pageOffers
}
