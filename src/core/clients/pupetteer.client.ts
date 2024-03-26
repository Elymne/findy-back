import { getRandomInt, wait } from "../tools/utils"
import logger from "../tools/logger"
import puppeteer, { Browser, Page, PuppeteerLaunchOptions } from "puppeteer"

export class PupetteerClient {
    private static instance: PupetteerClient

    private browser: Browser | null
    private browserWithGUI: Browser | null

    private options: PuppeteerLaunchOptions
    private optionsWithGUI: PuppeteerLaunchOptions
    private buffer: TypeWebSiteStacker[]
    private bufferLimit: number

    private constructor(options: PuppeteerLaunchOptions, optionsWithGUI: PuppeteerLaunchOptions) {
        this.options = options
        this.optionsWithGUI = optionsWithGUI
        this.bufferLimit = 20
        this.buffer = new Array<TypeWebSiteStacker>()
    }

    /**
     * Simplement l'accès au singleton en question.
     * @returns {PupetteerClient}
     */
    public static getInstance(): PupetteerClient {
        if (!PupetteerClient.instance) {
            PupetteerClient.instance = new PupetteerClient(
                {
                    headless: true,
                    defaultViewport: null,
                },
                {
                    headless: false,
                    defaultViewport: { height: 0, width: 0 },
                }
            )
        }
        return PupetteerClient.instance
    }

    /**
     * Initialise tous les valeurs de l'objet en question.
     * Si cette fonction n'est pas utilisé, l'objet ne sera pas utilisable.
     * A utiliser préférablement à l'initialisation de l'app.
     */
    public async init(): Promise<void> {
        await Promise.all([this.resetBrowser(), this.resetGUIBrowser()])
    }

    /**
     * Permet la creation d'une nouvelle page puppetteer.
     * Le nombre maximum de page ouverte possible est délimité à 30 (pour les deux navigateurs utilisées).
     * Le temps de création d'une page est variable pour différentes raisons :
     *  - Si beaucoup de page sont créée en même temps pour l'accès à un même site web, il est préférable de ne pas procéder à tous ces appels en même temps pour ne pas surcharger le site web en question ou simplement ne pas se faire éjecter par les bots sur le site en question.
     *  - Si trop de page sont ouvertes en même temps et qu'elles dépasse le nombre limite de page ouverte défini par la value de [bufferLimit] , on empêche la création d'une nouvelle page et attendons qu'une place se libère. Je fais ça pour éviter de surcharger mon serveur de page (qui sont déjà bien assez lourde). Tout ceci est géré via un buffer. Si le temps d'attente de la libération de l'une des page est trop longue, je casse le process est envoie une exception pour éviter des temps d'attente infini en cas de problème. Notons qu'on ne devrait jamais avoir ce problème car le temps de vie d'une page est de 10 secondes max.
     * @param {TypeWebSiteStacker} webSite Type de site web utlisé. Important car j'utilise des broswers différents pour certains type de site web.
     * @returns {Page} Une page manipulable pour effectuer nos recherches.
     */
    public async createPage(webSite: TypeWebSiteStacker): Promise<Page> {
        if (!this.browser || !this.browserWithGUI) {
            throw new Error("No browsers has been init. Page cannot be created.")
        }

        let iterationTimeout = 0
        while (this.buffer.length > this.bufferLimit && iterationTimeout < 10_000) {
            await wait(1000)
            iterationTimeout += 1000
        }

        if (iterationTimeout >= 10_000) {
            throw Error("Timeout while waiting for a new page to be created.")
        }

        if (this.buffer.lastIndexOf(webSite) !== -1) {
            await wait(getRandomInt(3) * 1000)
        }

        this.buffer.push(webSite)

        let newPage: Page
        switch (webSite) {
            case TypeWebSiteStacker.wttj:
                newPage = await this.browser.newPage()
                break
            case TypeWebSiteStacker.hw:
                newPage = await this.browser.newPage()
                break
            case TypeWebSiteStacker.indeed:
                newPage = await this.browserWithGUI.newPage()
                break
        }

        await newPage.setRequestInterception(true)
        newPage.on("request", (request) => {
            if (request.resourceType() === "image" || request.resourceType() === "stylesheet" || request.resourceType() === "font") {
                request.abort()
                return
            }
            request.continue()
        })

        newPage.on("disconnected", () => {
            this.buffer.splice(this.buffer.lastIndexOf(webSite), 1)
        })

        setTimeout(() => {
            if (!newPage.isClosed()) {
                newPage.close()
                this.buffer.splice(this.buffer.lastIndexOf(webSite), 1)
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

    private async resetGUIBrowser(): Promise<void> {
        this.browserWithGUI = null
        this.browserWithGUI = await puppeteer.launch(this.optionsWithGUI)
        this.browserWithGUI.on("disconnected", async () => {
            logger.warn("[PupetteerClient]", ["Browser GUI has been disconnected", "A new one will be initialized"])
            this.resetGUIBrowser()
        })
    }
}

export enum TypeWebSiteStacker {
    wttj,
    hw,
    indeed,
}
