import { getRandomInt, wait } from "@App/core/utils"
import puppeteer, { Browser, Page, PuppeteerLaunchOptions } from "puppeteer"

export class PupetteerClient {
    private static instance: PupetteerClient
    private browser: Browser
    private options: PuppeteerLaunchOptions | undefined
    private buffer: WebSite[] = []

    private constructor(options?: PuppeteerLaunchOptions) {
        this.options = options
    }

    public static getInstance(options?: PuppeteerLaunchOptions): PupetteerClient {
        if (!PupetteerClient.instance) {
            PupetteerClient.instance = new PupetteerClient(options ?? { headless: true, defaultViewport: null })
        }
        return PupetteerClient.instance
    }

    public async createPage(webSite: WebSite): Promise<Page> {
        if (!this.browser) {
            this.browser = await puppeteer.launch(this.options)
        }

        while (this.buffer.filter((e) => e === webSite).length > 5) {
            await wait(1000)
        }

        if (this.buffer.lastIndexOf(webSite) !== -1) {
            await wait(getRandomInt(3) * 1000)
        }

        this.buffer.push(webSite)
        const newPage = await this.browser.newPage()

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
        }, 10000)

        return newPage
    }

    public async closePage(page: Page, webSite: WebSite): Promise<void> {
        this.buffer.splice(this.buffer.lastIndexOf(webSite), 1)
        page.close()
    }
}

export enum WebSite {
    wttj,
}

export interface Token {
    scope: string
    expires_in: number
    token_type: string
    access_token: string
}
