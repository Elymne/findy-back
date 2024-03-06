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
    findAllByQuery: (keyWords: string, lat: number, lng: number) => Promise<JobOfferWTTJ[]>
}

export const JobOfferWTTJDatasourceImpl: JobOfferWTTJDatasource = {
    findAllByQuery: async function (keyWords: string, lat: number, lng: number): Promise<JobOfferWTTJ[]> {
        const url = `
        ${wttjUrl}
        ?${wttjCountryQuery}=FR
        &${wttjContractTypeQuery}=apprenticeship
        &${wttjParamsQuery}=${keyWords}
        &${wttjAroundLatLng}=${lat},${lng}
        &${wttjAroundRadius}=20
        &${wttjPageQuery}=1`

        const browser = await puppeteer.launch({ headless: true, defaultViewport: null })
        const { nbPages, firstResult } = await firstCall(browser, url)

        if (nbPages && nbPages == 0) {
            return firstResult
        }

        const result: JobOfferWTTJ[] = [...firstResult]
        const callSequenses: Promise<JobOfferWTTJ[]>[] = []

        for (let i = 2; i < nbPages!; i++) {
            const nextUrl = `
            ${wttjUrl}
            ?${wttjCountryQuery}=FR
            &${wttjContractTypeQuery}=apprenticeship
            &${wttjParamsQuery}=${keyWords}
            &${wttjAroundLatLng}=${lat},${lng}
            &${wttjAroundRadius}=20
            &${wttjPageQuery}=${i}`

            callSequenses.push(nextCall(browser, nextUrl))
        }

        const sequenseResults = await Promise.all(callSequenses)
        sequenseResults.forEach((elem) => result.push(...elem))

        browser.close()
        return result
    },
}

const firstCall = async (browser: Browser, url: string): Promise<{ nbPages?: number; firstResult: JobOfferWTTJ[] }> => {
    const page = await browser.newPage()
    await page.goto(url, { timeout: 5000 })
    await new Promise((f) => setTimeout(f, 2000))

    const pagerDiv = await page.$(`[aria-label="Pagination"]`)
    const pagerRows = await pagerDiv?.$$("li")

    let nbPages = 0

    if (pagerRows) {
        const liv = await pagerRows[pagerRows.length - 2].$("a")
        nbPages = parseInt((await liv?.evaluate((x) => x.textContent)) ?? "0")
    }

    const result = await scrapJobOffers(page)

    await page.close()

    return { nbPages: nbPages, firstResult: result }
}

const nextCall = async (browser: Browser, url: string): Promise<JobOfferWTTJ[]> => {
    const page = await browser.newPage()
    await page.goto(url, { timeout: 3000 })
    await new Promise((f) => setTimeout(f, 2000))

    const result = await scrapJobOffers(page)

    await page.close()

    return result
}

const scrapJobOffers = async (page: Page): Promise<JobOfferWTTJ[]> => {
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
