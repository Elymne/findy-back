import JobOffer from "@App/domain/entities/jobOffer.entity"
import SourceSite from "@App/domain/enums/sourceData.enum"
import { Page } from "puppeteer"

export async function scrapHWPage(page: Page): Promise<JobOffer[]> {
    const rows = await page.$$("section.serp > div > section > ul.crushed > li")
    const result = new Array<JobOffer>()

    for (let i = 0; i < rows.length; i++) {
        const [imagesSelector, companySelector, hrefSelector, tagsSelector, createdSelector] = await Promise.all([
            rows[i].$$("img"),
            rows[i].$$('[data-cy="companyName"] > span'),
            rows[i].$$("a"),
            rows[i].$$("#infos"),
            rows[i].$$('[data-cy="publishDate"]'),
        ])

        let title: string | null | undefined = undefined
        let companyName: string | null | undefined = undefined
        let cityName: string | null | undefined = undefined
        let image1: string | null | undefined = undefined
        let image2: string | null | undefined = undefined
        let accessUrl: string | null | undefined = undefined
        let created: string | null | undefined = undefined

        if (typeof imagesSelector[0] !== "undefined") {
            image1 = await imagesSelector[0].evaluate((img) => img.getAttribute("src"))
        }
        if (typeof imagesSelector[1] !== "undefined") {
            image2 = await imagesSelector[1].evaluate((img) => img.getAttribute("src"))
        }
        if (typeof companySelector[0] !== "undefined") {
            companyName = await await companySelector[0].evaluate((span) => span.textContent)
        }
        if (typeof hrefSelector[0] !== "undefined") {
            title = await hrefSelector[0].evaluate((a) => a.textContent?.trim())
            accessUrl = await hrefSelector[0].evaluate((a) => a.getAttribute("href"))
        }
        if (typeof createdSelector[0] !== "undefined") {
            created = await createdSelector[0].evaluate((span) => span.textContent?.trim())
        }
        for (let j = 0; j < tagsSelector.length; j++) {
            const spanSelector = await tagsSelector[j].$("span > span")
            if (spanSelector) {
                cityName = await spanSelector.evaluate((span) => span.textContent)
            }
        }

        result.push({
            id: undefined,
            sourceData: SourceSite.hw,
            title: title as string,
            cityName: cityName as string,
            companyName: companyName as string,
            companyLogoUrl: image2 as string,
            imageUrl: image1 as string,
            sourceUrl: accessUrl as string,
            createdWhile: created as string,
            createdAt: undefined,
            updatedAt: undefined,
        })
    }

    return result
}
