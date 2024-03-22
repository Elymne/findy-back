import { Page } from "puppeteer"
import { JobOfferWTTJ } from "../models/JobOfferWTTJ"

export const scrapWTTJPage = async (
    page: Page,
    options?: {
        nb?: number
    }
): Promise<JobOfferWTTJ[]> => {
    const result: JobOfferWTTJ[] = []

    const rows = await page.$$("li.ais-Hits-list-item")

    const max = options?.nb && options.nb <= rows.length ? options.nb : rows.length

    for (let i = 0; i < max; i++) {
        const [imageSelectors, h4selectors, spanSelectors, aSelector] = await Promise.all([
            rows[i].$$("img"),
            rows[i].$$("h4"),
            rows[i].$$("span"),
            rows[i].$$("a"),
        ])

        const [imageUrl, companyLogoUrl, title, companyName, cityName, sourceUrl, dateCreation] = await Promise.all([
            imageSelectors[0].evaluate((img) => img.getAttribute("src")),
            imageSelectors[1].evaluate((img) => img.getAttribute("src")),
            h4selectors[0].evaluate((h4) => h4.textContent),
            spanSelectors[0].evaluate((span) => span.textContent),
            spanSelectors[2].evaluate((span) => span.textContent),
            aSelector[0].evaluate((span) => span.getAttribute("href")),
            spanSelectors[spanSelectors.length - 1].evaluate((span) => span.textContent),
        ])

        result.push({
            title: title as string,
            image: imageUrl as string,
            companyLogo: companyLogoUrl as string,
            company: companyName as string,
            city: cityName as string,
            created: dateCreation as string,
            accessUrl: sourceUrl as string,
        })
    }

    return result
}

// TODO Surement utile, on va voir.
// export const scrapNbPage = async (page: Page): Promise<number> => {
//     return 0
// }
