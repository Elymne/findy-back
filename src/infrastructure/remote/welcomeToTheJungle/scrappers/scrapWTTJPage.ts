import JobOffer from "@App/domain/entities/jobOffer.entity"
import SourceSite from "@App/domain/enums/sourceData.enum"
import { Page } from "puppeteer"
import wttjConst from "../configs/wttj.const"

export async function scrapWTTJPage(page: Page, nb?: number): Promise<JobOffer[]> {
    const rows = await page.$$('[data-testid="search-results-list-item-wrapper"]')
    const max = nb && nb <= rows.length ? nb : rows.length
    const result = new Array<JobOffer>()

    for (let i = 0; i < max; i++) {
        const [imageSelectors, h4selectors, spanSelectors, aSelector] = await Promise.all([
            rows[i].$$("img"),
            rows[i].$$("h4"),
            rows[i].$$("span"),
            rows[i].$$("a"),
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
            result.push({
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
            } as JobOffer)
        }
    }

    return result
}
