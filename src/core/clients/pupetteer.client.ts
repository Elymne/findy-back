import logger from "../tools/logger"
import puppeteer, { Browser, Page, PuppeteerLaunchOptions } from "puppeteer"

export default class PupetteerClient {
    private static instance: PupetteerClient
    private browser: Browser | null
    private options: PuppeteerLaunchOptions

    private constructor(options: PuppeteerLaunchOptions) {
        this.options = options
    }

    public static getInstance(): PupetteerClient {
        if (!PupetteerClient.instance) {
            PupetteerClient.instance = new PupetteerClient({
                headless: true,
                defaultViewport: null,
            })
        }
        return PupetteerClient.instance
    }

    public async init(): Promise<void> {
        await Promise.all([this.resetBrowser()])
    }

    public async createPage(): Promise<Page> {
        if (!this.browser) {
            throw new Error("No browsers has been init. Page cannot be created.")
        }

        let newPage: Page
        newPage = await this.browser.newPage()

        await newPage.setRequestInterception(true)
        newPage.on("request", (request) => {
            if (request.resourceType() === "image" || request.resourceType() === "stylesheet" || request.resourceType() === "font") {
                request.abort()
                return
            }
            request.continue()
        })

        setTimeout(() => {
            if (!newPage.isClosed()) {
                newPage.close()
            }
        }, 10_000)

        return newPage
    }

    private async resetBrowser(): Promise<void> {
        this.browser = null
        this.browser = await puppeteer.launch(this.options)
        this.browser.on("disconnected", async () => {
            logger.warn("[PupetteerClient]", ["The headless Browser has been disconnected", "A new one will be initialized"])
            this.resetBrowser()
        })
    }
}
