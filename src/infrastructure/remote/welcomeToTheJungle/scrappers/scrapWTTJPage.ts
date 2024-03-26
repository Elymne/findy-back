import JobOffer from "@App/domain/entities/jobOffer.entity"
import SourceSite from "@App/domain/enums/sourceData.enum"
import { Page } from "puppeteer"

export async function scrapWTTJPage(page: Page, nb?: number): Promise<JobOffer[]> {
    const rows = await page.$$('[data-testid="search-results-list-item-wrapper"]')
    const max = nb && nb <= rows.length ? nb : rows.length
    const result = new Array<JobOffer>(max)

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
            id: undefined,
            sourceData: SourceSite.wttj,
            title: title as string,
            cityName: cityName as string,
            companyName: companyName as string,
            companyLogoUrl: companyLogoUrl as string,
            imageUrl: imageUrl as string,
            sourceUrl: sourceUrl as string,
            createdWhile: dateCreation as string,
            createdAt: undefined,
            updatedAt: undefined,
        })
    }

    return result
}
