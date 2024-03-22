import { Page } from "puppeteer"
import { JobOfferHW } from "../models/jobOfferHW"

export async function scrapHWPage(page: Page): Promise<JobOfferHW[]> {
    const result: JobOfferHW[] = []

    console.clear()
    const rows = await page.$$("section.serp > div > section > ul.crushed > li")
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
            title: title,
            company: companyName,
            city: cityName,
            image1: image1,
            image2: image2,
            accessUrl: accessUrl,
            created: created,
        })
    }

    return result
}
