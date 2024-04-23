import logger from "../tools/logger"
import puppeteer, { Browser, BrowserEvent, Page, PageEvent, PuppeteerLaunchOptions } from "puppeteer"

export default class PupetteerClient {
    private static instance: PupetteerClient
    private browser: Browser | null
    private options: PuppeteerLaunchOptions

    private crashBuffer: number
    private pageFailedBuffer: number

    private constructor(options: PuppeteerLaunchOptions) {
        this.options = options
        this.crashBuffer = 0
    }

    public static getInstance(): PupetteerClient {
        if (!PupetteerClient.instance) {
            PupetteerClient.instance = new PupetteerClient({
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
                headless: true,
            })
        }
        return PupetteerClient.instance
    }

    public async init(): Promise<void> {
        await Promise.all([this.initBrowser()])
    }

    public async createPage(): Promise<Page> {
        if (!this.browser) {
            throw new Error("No browsers has been init. Page cannot be created.")
        }

        const newPage: Page = await this.browser.newPage()

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

                if (this.pageFailedBuffer == 0) {
                    setTimeout(() => (this.pageFailedBuffer = 0), 120_000)
                }

                this.pageFailedBuffer++
                logger.warn("[PupetteerClient]", ["A page couldn't fetch data", `Page error buffer number : ${this.pageFailedBuffer}`])

                if (this.pageFailedBuffer > 5) {
                    logger.warn("[PupetteerClient]", [
                        "The pages created from current browser keeps getting no response",
                        "A new one will be initialized",
                    ])
                    this.initBrowser()
                }
            }
        }, 10_000)

        return newPage
    }

    private async initBrowser(): Promise<void> {
        this.browser = null
        this.browser = await puppeteer.launch(this.options)

        if (this.crashBuffer >= 5) {
            logger.error("[PupetteerClient]", ["The headless Browser keeps getting disconnected", "The server will be stopped"])
            throw Error("crashBuffer has exeeded the limit. Puppeteer browser client has crash to many time in a row")
        }

        this.browser.on(BrowserEvent.Disconnected, async () => {
            if (this.crashBuffer == 0) {
                setTimeout(() => (this.crashBuffer = 0), 20_000)
            }

            this.crashBuffer++
            logger.warn("[PupetteerClient]", ["The headless Browser has been disconnected", "A new one will be initialized"])
            this.initBrowser()
        })
    }
}
