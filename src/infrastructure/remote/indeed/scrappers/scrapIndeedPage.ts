import JobOffer from "@App/domain/entities/jobOffer.entity"
import SourceSite from "@App/domain/enums/sourceData.enum"
import { Page } from "puppeteer"
import indeedConst from "../configs/indeed.configs"
import PageResult from "@App/domain/entities/pageResult.entity"

export async function scrapIndeedPage(page: Page): Promise<PageResult> {
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
            jobOffers.push({
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
            } as JobOffer)
        }
    }

    return {
        totalPagesNb: 1,
        jobOffers: jobOffers,
    } as PageResult
}
