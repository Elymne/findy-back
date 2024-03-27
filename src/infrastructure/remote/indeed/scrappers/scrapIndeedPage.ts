import JobOffer from "@App/domain/entities/jobOffer.entity"
import SourceSite from "@App/domain/enums/sourceData.enum"
import { Page } from "puppeteer"

export async function scrapIndeedPage(page: Page): Promise<JobOffer[]> {
    const rows = await page.$$("#mosaic-provider-jobcards > ul > li")
    const result = new Array<JobOffer>()

    for (let i = 0; i < rows.length; i++) {
        const [imagesSelector, hrefSelector, companySelector, citySelector, createdWhileSelector] = await Promise.all([
            rows[i].$("img"),
            rows[i].$("a"),
            rows[i].$('[data-testid="company-name"]'),
            rows[i].$('[data-testid="text-location"]'),
            rows[i].$('[data-testid="myJobsStateDate"]'),
        ])

        let title: string | null | undefined = undefined
        let companyLogoUrl: string | null | undefined = undefined
        let sourceUrl: string | null | undefined = undefined
        let companyName: string | null | undefined = undefined
        let cityName: string | null | undefined = undefined
        let createdWhile: string | null | undefined = undefined

        if (imagesSelector && typeof imagesSelector !== "undefined") {
            companyLogoUrl = await imagesSelector.evaluate((img) => img.getAttribute("src"))
        }

        if (hrefSelector && typeof hrefSelector !== "undefined") {
            sourceUrl = await hrefSelector.evaluate((a) => a.getAttribute("href"))
            title = await hrefSelector.evaluate((a) => a.textContent)
        }

        if (companySelector && typeof companySelector !== "undefined") {
            companyName = await companySelector.evaluate((span) => span.textContent)
        }

        if (citySelector && typeof citySelector !== "undefined") {
            cityName = await citySelector.evaluate((div) => div.textContent)
        }

        if (createdWhileSelector && typeof createdWhileSelector !== "undefined") {
            createdWhile = await createdWhileSelector.evaluate((span) => span.textContent)
        }

        result.push({
            id: undefined,
            title: title as string,
            cityName: cityName as string,
            companyLogoUrl: companyLogoUrl as string,
            companyName: companyName as string,
            sourceUrl: sourceUrl as string,
            createdWhile: createdWhile as string,
            imageUrl: "", // Todo gérer une image par défaut.
            sourceData: SourceSite.indeed,
            createdAt: undefined,
            updatedAt: undefined,
        })
    }

    return result
}
