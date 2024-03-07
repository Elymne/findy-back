import {
    wttjUrl,
    wttjContractTypeQuery,
    wttjCountryQuery,
    wttjPageQuery,
    wttjParamsQuery,
    wttjAroundLatLng,
    wttjAroundRadius,
} from "./configs/wttj.const"
import { JobOfferWTTJ } from "./models/JobOfferWTTJ"
import puppeteer, { Browser, Page } from "puppeteer"

export interface JobOfferWTTJDatasource {
    findAllByQuery: (keyWords: string, lat: number, lng: number, page: number) => Promise<JobOfferWTTJ[]>
}

export const JobOfferWTTJDatasourceImpl: JobOfferWTTJDatasource = {
    findAllByQuery: async function (keyWords: string, lat: number, lng: number, page: number): Promise<JobOfferWTTJ[]> {
        const url: string = "".concat(
            wttjUrl,
            `?${wttjCountryQuery}=FR`,
            `&${wttjContractTypeQuery}=apprenticeship`,
            `&${wttjParamsQuery}=${keyWords}`,
            `&${wttjAroundLatLng}=${lat},${lng}`,
            `&${wttjPageQuery}=${page}`,
            `&${wttjAroundRadius}=20`
        )

        const browser = await puppeteer.launch({ headless: true, defaultViewport: null })
        const result = await getJobOffersFromBrowser(browser, url)

        browser.close()
        return result
    },
}

const getJobOffersFromBrowser = async (browser: Browser, url: string): Promise<JobOfferWTTJ[]> => {
    const page = await browser.newPage()
    await page.goto(url, { timeout: 10000 })
    await new Promise((f) => setTimeout(f, 3000))

    const result = await scrapFromPage(page)
    await page.close()

    return result
}

const scrapFromPage = async (page: Page): Promise<JobOfferWTTJ[]> => {
    const result: JobOfferWTTJ[] = []

    const rows = await page.$$("li.ais-Hits-list-item")

    console.clear()
    console.log(rows)

    for (const row of rows) {
        const imageSelectors = await row.$$("img")
        const imageUrl = (await imageSelectors[0].evaluate((img) => img.getAttribute("src"))) as string
        const companyLogoUrl = (await imageSelectors[1].evaluate((img) => img.getAttribute("src"))) as string

        const h4selectors = await row.$$("h4")
        const title = (await h4selectors[0].evaluate((h4) => h4.textContent)) as string

        const spanSelectors = await row.$$("span")
        const companyName = (await spanSelectors[0].evaluate((span) => span.textContent)) as string
        const cityName = (await spanSelectors[2].evaluate((span) => span.textContent)) as string

        const aSelector = await row.$$("a")
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
