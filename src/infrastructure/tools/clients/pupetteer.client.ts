import { getRandomInt, wait } from "@App/core/utils"
import { uuid } from "@App/core/uuid"
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

        console.log(this.buffer.filter((e) => e === webSite).length)

        while (this.buffer.filter((e) => e === webSite).length > 2) {
            console.log("On va devoir vraiment patienter")
            console.log(this.buffer)
            await wait(1000)
        }
        if (this.buffer.lastIndexOf(webSite) !== -1) {
            await wait(getRandomInt(3) * 1000)
        }

        this.buffer.push(webSite)
        const newPage = await this.browser.newPage()

        setTimeout(() => {
            if (!newPage.isClosed()) {
                newPage.close()
            }
        }, 60000)

        return newPage
    }

    public async closePage(page: Page, webSite: WebSite): Promise<void> {
        this.buffer.splice(this.buffer.lastIndexOf(webSite), 1)
        console.log("Et un de fermé")
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
