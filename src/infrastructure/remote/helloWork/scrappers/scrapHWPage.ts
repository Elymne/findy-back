import JobOffer from "@App/domain/entities/jobOffer.entity"
import SourceSite from "@App/domain/enums/sourceData.enum"
import { Page } from "puppeteer"
import indeedConst from "../../indeed/configs/indeed.configs"
import PageOffers from "@App/domain/entities/pageResult.entity"

/// TODO Faire un checking plus poussé pour les images. Il y a des paternes qui se répète pour l'utilisation des image sur ce site.
export async function scrapHWPage(page: Page): Promise<PageOffers> {
    const jobOffers = new Array<JobOffer>()

    const jobRows = await page.$$("section.serp > div > section > ul.crushed > li")

    const pageRows = await page.$$("div > div > div > ul > li")

    for (let i = 0; i < jobRows.length; i++) {
        const [imagesSelector, companySelector, hrefSelector, tagsSelector, createdSelector] = await Promise.all([
            jobRows[i].$$("img"),
            jobRows[i].$$('[data-cy="companyName"] > span'),
            jobRows[i].$$("a"),
            jobRows[i].$$("#infos"),
            jobRows[i].$$('[data-cy="publishDate"]'),
        ])

        const image1 = await imagesSelector[0]?.evaluate((img) => img.getAttribute("src"))
        const image2 = await imagesSelector[1]?.evaluate((img) => img.getAttribute("src"))
        const companyName = await companySelector[0]?.evaluate((span) => span.textContent)
        const title = await hrefSelector[0]?.evaluate((a) => a.textContent?.trim())
        const sourceUrl = await hrefSelector[0]?.evaluate((a) => a.getAttribute("href"))
        const createdWhile = await createdSelector[0]?.evaluate((span) => span.textContent?.trim())

        let cityName: string | null | undefined = undefined
        for (let j = 0; j < tagsSelector.length; j++) {
            const spanSelector = await tagsSelector[j].$("span > span")
            if (spanSelector) {
                cityName = await spanSelector.evaluate((span) => span.textContent)
            }
        }

        if (title && companyName && cityName && sourceUrl && createdWhile) {
            const jobOffer: JobOffer = {
                sourceData: SourceSite.hw,
                sourceUrl: indeedConst.baseUrl + sourceUrl,
                title: title,
                companyName: companyName,
                cityName: cityName,
                createdWhile: createdWhile,

                companyLogoUrl: image2 ?? image1 ?? "http://localhost:3000/static/images/logo_placeholder.png",
                imageUrl: image2
                    ? image1 ?? "http://localhost:3000/static/images/placeholder.jpg"
                    : "http://localhost:3000/static/images/placeholder.jpg",

                id: undefined,
                createdAt: undefined,
                updatedAt: undefined,
            }
            jobOffers.push(jobOffer)
        }
    }

    const pageOffers: PageOffers = { totalPagesNb: 1, jobOffers: jobOffers }

    return pageOffers
}
