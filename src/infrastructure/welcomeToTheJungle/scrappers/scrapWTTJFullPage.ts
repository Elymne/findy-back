import { Page } from "puppeteer"
import { JobOfferWTTJ } from "../models/JobOfferWTTJ"

export const scrapWTTJPage = async (
    page: Page,
    options?: {
        nb?: number | undefined | null
    }
): Promise<JobOfferWTTJ[]> => {
    const result: JobOfferWTTJ[] = []

    const rows = await page.$$("li.ais-Hits-list-item")
    const max = options?.nb && options.nb <= rows.length ? options.nb : rows.length

    for (let i = 0; i < max; i++) {
        const imageSelectors = await rows[i].$$("img")
        const imageUrl = (await imageSelectors[0].evaluate((img) => img.getAttribute("src"))) as string
        const companyLogoUrl = (await imageSelectors[1].evaluate((img) => img.getAttribute("src"))) as string

        const h4selectors = await rows[i].$$("h4")
        const title = (await h4selectors[0].evaluate((h4) => h4.textContent)) as string

        const spanSelectors = await rows[i].$$("span")
        const companyName = (await spanSelectors[0].evaluate((span) => span.textContent)) as string
        const cityName = (await spanSelectors[2].evaluate((span) => span.textContent)) as string

        const aSelector = await rows[i].$$("a")
        const sourceUrl = ("https://www.welcometothejungle.com" +
            (await aSelector[0].evaluate((span) => span.getAttribute("href")))) as string

        const dateCreation = (await spanSelectors[spanSelectors.length - 1].evaluate((span) => span.textContent)) as string

        result.push({
            title: title,
            image: imageUrl,
            companyLogo: companyLogoUrl,
            company: companyName,
            city: cityName,
            created: dateCreation,
            accessUrl: sourceUrl,
        })
    }

    return result
}

// TODO Surement utile, on va voir.
// export const scrapNbPage = async (page: Page): Promise<number> => {
//     return 0
// }
