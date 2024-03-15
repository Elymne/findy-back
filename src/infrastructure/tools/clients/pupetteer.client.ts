import puppeteer, { Browser, Page, PuppeteerLaunchOptions } from "puppeteer"

export class PupetteerClient {
    private static instance: PupetteerClient
    private browser: Browser
    private options: PuppeteerLaunchOptions | undefined

    private constructor(options?: PuppeteerLaunchOptions) {
        this.options = options
    }

    public static getInstance(options?: PuppeteerLaunchOptions): PupetteerClient {
        if (!PupetteerClient.instance) {
            PupetteerClient.instance = new PupetteerClient(options ?? { headless: true, defaultViewport: null })
        }
        return PupetteerClient.instance
    }

    public async createPage(): Promise<Page> {
        if (!this.browser) {
            this.browser = await puppeteer.launch(this.options)
        }

        const newPage = await this.browser.newPage()

        setTimeout(() => {
            if (!newPage.isClosed()) newPage.close()
        }, 60000)

        return newPage
    }
}

export interface Token {
    scope: string
    expires_in: number
    token_type: string
    access_token: string
}
