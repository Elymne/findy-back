import { aroundQuery, baseUrl, countryQuery, pageQuery, paramsQuery } from "./configs/wttj.const"
import { JobOfferWTTJ } from "./models/JobOfferWTTJ"
import puppeteer from "puppeteer"

export interface JobOfferWTTJDatasource {
    findAll: (keyWords: string, city: string) => Promise<JobOfferWTTJ[]>
}

export const JobOfferWTTJDatasourceImpl: JobOfferWTTJDatasource = {
    /**
     * TODO Gestion de la pagination.
     * TODO Gestion des mots clés.
     * TODO Gestion du lieu
     * TODO Gestion des params optionnels
     * @returns
     */
    findAll: async function (keyWords: string, city: string): Promise<JobOfferWTTJ[]> {
        const browser = await puppeteer.launch({ headless: true, defaultViewport: null })
        const page = await browser.newPage()

        const url = `${baseUrl}?${countryQuery}=FR&${paramsQuery}=${keyWords}&${pageQuery}=1&${aroundQuery}=${city}`

        await page.goto(url, { timeout: 3000 })
        await new Promise((f) => setTimeout(f, 1000))

        const result: JobOfferWTTJ[] = []

        const rows = await page.$$("li.ais-Hits-list-item")
        for (const row of rows) {
            const imageSelectors = await row.$$("img")
            const imageUrl = (await imageSelectors[0].evaluate((img) => img.getAttribute("src"))) as string
            const companyLogoUrl = (await imageSelectors[1].evaluate((img) => img.getAttribute("src"))) as string
            const h4selectors = await row.$$("h4")
            const title = (await h4selectors[0].evaluate((h4) => h4.textContent)) as string
            const spanSelectors = await row.$$("span")
            const companyName = (await spanSelectors[0].evaluate((span) => span.textContent)) as string
            const cityName = (await spanSelectors[2].evaluate((span) => span.textContent)) as string

            const tags: string[] = []
            for (let i = 3; i < spanSelectors.length - 1; i++) {
                tags.push((await spanSelectors[i].evaluate((span) => span.textContent)) as string)
            }

            const dateCreation = (await spanSelectors[spanSelectors.length - 1].evaluate((span) => span.textContent)) as string

            result.push({
                title: title,
                image: imageUrl,
                companyLogo: companyLogoUrl,
                company: companyName,
                city: cityName,
                created: dateCreation,
                accessUrl: "",
                tags: tags,
            })
        }

        return result
    },
}
