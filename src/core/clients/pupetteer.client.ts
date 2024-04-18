import logger from "../tools/logger"
import puppeteer, { Browser, Page, PuppeteerLaunchOptions } from "puppeteer"

export class PupetteerClient {
    private static instance: PupetteerClient

    private browser: Browser | null
    //private browserWithGUI: Browser | null

    private options: PuppeteerLaunchOptions

    private constructor(options: PuppeteerLaunchOptions) {
        this.options = options
    }

    /**
     * Simplement l'accès au singleton en question.
     * @returns {PupetteerClient}
     */
    public static getInstance(): PupetteerClient {
        if (!PupetteerClient.instance) {
            PupetteerClient.instance = new PupetteerClient({
                headless: true,
                defaultViewport: null,
            })
        }
        return PupetteerClient.instance
    }

    /**
     * Initialise tous les valeurs de l'objet en question.
     * Si cette fonction n'est pas utilisé, l'objet ne sera pas utilisable.
     * A utiliser préférablement à l'initialisation de l'app.
     */
    public async init(): Promise<void> {
        await Promise.all([this.resetBrowser()])
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
        if (!this.browser) {
            throw new Error("No browsers has been init. Page cannot be created.")
        }

        let newPage: Page
        switch (webSite) {
            case TypeWebSiteStacker.wttj:
                newPage = await this.browser.newPage()
                break
            case TypeWebSiteStacker.hw:
                newPage = await this.browser.newPage()
                break
            case TypeWebSiteStacker.indeed:
                newPage = await this.browser.newPage()
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

export enum TypeWebSiteStacker {
    wttj,
    hw,
    indeed,
}
