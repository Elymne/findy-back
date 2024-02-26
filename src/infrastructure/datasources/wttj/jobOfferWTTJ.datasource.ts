import { ShortJobOfferWTTJ } from "./models/shortJobOfferWTTJ"
import puppeteer from "puppeteer"

export interface JobOfferWTTJDatasource {
    findReduced: () => Promise<ShortJobOfferWTTJ[]>
    testScrap: () => Promise<void>
}

export const JobOfferWTTJDatasourceImpl: JobOfferWTTJDatasource = {
    findReduced: async function (): Promise<ShortJobOfferWTTJ[]> {
        return []
    },
    testScrap: async function (): Promise<void> {
        console.clear()

        const browser = await puppeteer.launch({ headless: true, defaultViewport: null })
        console.log("Browser init")

        const page = await browser.newPage()
        console.log("New page")

        await page.goto("https://www.welcometothejungle.com/fr/jobs?refinementList%5Boffices.country_code%5D%5B%5D=FR&query=communication&page=1")
        console.log("Access to the new page")

        await page.waitForSelector(`[data-testid="jobs-search-results-count"]`, { timeout: 3000 })
        await new Promise((f) => setTimeout(f, 1000))
        console.log("Page loaded, loot everything !")

        const rows = await page.$$("li.ais-Hits-list-item")

        // TODO Tout récupérer et voilà.
        for (let row of rows) {
            const img = await row.$("div > a > img")
            const url = await img?.evaluate((x) => x.getAttribute("src"))
            console.log(url)
        }
    },
}
