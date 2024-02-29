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
import puppeteer from "puppeteer"

export interface JobOfferWTTJDatasource {
    findAll: (keyWords: string, lat: number, lng: number) => Promise<JobOfferWTTJ[]>
}

export const JobOfferWTTJDatasourceImpl: JobOfferWTTJDatasource = {
    /**
     * TODO Gestion de la pagination.
     * TODO Gestion des mots clés.
     * TODO Gestion du lieu
     * TODO Gestion des params optionnels
     * @returns
     */
    findAll: async function (keyWords: string, lat: number, lng: number): Promise<JobOfferWTTJ[]> {
        console.clear()
        const browser = await puppeteer.launch({ headless: true, defaultViewport: null })
        const page = await browser.newPage()

        const url = `
        ${wttjUrl}?${wttjCountryQuery}=FR&${wttjContractTypeQuery}=apprenticeship&${wttjParamsQuery}=${keyWords}&${wttjPageQuery}=1&${wttjAroundLatLng}=${lat},${lng}&${wttjAroundRadius}=20`

        await page.goto(url, { timeout: 3000 })
        await new Promise((f) => setTimeout(f, 3000))

        const result: JobOfferWTTJ[] = []

        const pagerDiv = await page.$(`[aria-label="Pagination"]`)
        const pagerRows = await pagerDiv?.$$("li")

        if (pagerRows) {
            const liv = await pagerRows[pagerRows.length - 2].$("a")
            const textCont = await liv?.evaluate((x) => x.textContent)
            console.log(`Valeur text div a : ${textCont}`)
        }

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
    },
}
