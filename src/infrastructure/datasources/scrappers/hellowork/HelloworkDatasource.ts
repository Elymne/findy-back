import Offer, { OfferOrigin } from "@App/domain/models/Offer.model"
import OfferScrapperRepository from "@App/domain/repositories/OfferScrapper.repository"
import axios from "axios"
import { load } from "cheerio"
import { v4 as uuidv4 } from "uuid"

/**
 * Class that contain function to scrap Hellowork offers pages.
 * This class implements @interface OfferScrapperRepository that is used by usecases to scrap data for the local datasource.
 */
export default class HelloworkDatasource implements OfferScrapperRepository {
    /**
     * Scrap one page of job offers from Hellowork website.
     *
     * @param {number} pageIndex The current page to scrap from Hellowork student job offers.
     * @returns {Job[]} The list of job offers scrapped from Hellowork website.
     */
    async getOnePage(pageIndex: number): Promise<Offer[]> {
        const offers: Offer[] = []

        const options = {
            method: "GET",
            url: "https://www.hellowork.com/fr-fr/emploi/recherche.html?k=&k_autocomplete=&l=&l_autocomplete=&st=relevance&c=Alternance&cod=all&d=all",
            params: {
                p: pageIndex,
            },
        }

        const response = await axios.request<string>(options)
        const $ = load(response.data)

        const cards = $("div > section > ul.tw-grid > li")
        for (let i = 0; i < cards.length; i++) {
            let url: string | undefined = undefined
            let title: string | undefined = undefined
            let companyName: string | undefined = undefined
            let zoneName: string | undefined = undefined
            let logoUrl: string | undefined = undefined
            let imgUrl: string | undefined = undefined
            let createdAt: Date | undefined = undefined

            // Find <a> href data to access detailed offer.
            const hrefElement = $(cards[i]).find("div > header > div > a")
            url = `https://www.hellowork.com${hrefElement.attr("href")}`

            // Find text for title and company.
            const textElement = $(cards[i]).find(`div > header > div > a > h3 > p`)
            title = $(textElement[0]).text()
            companyName = $(textElement[1]).text()

            // Tags.
            const tagsElement = $(cards[i]).find(`div.tw-tag-secondary-s`)
            for (let i = 0; i < tagsElement.length; i++) {
                const tag = $(tagsElement[i]).text().trim()
                if (tag != "Alternance") {
                    zoneName = tag
                }
            }

            // Images urls.
            const headerImageElement = $(cards[i]).find(`div > div > header`)[0]
            const imageElements = $(headerImageElement).find("img")
            if (imageElements.length == 1) {
                logoUrl = imageElements.first().attr("src")
            } else {
                logoUrl = $(imageElements[1]).attr("src")
                imgUrl = $(imageElements[0]).attr("src")
            }

            // Parse date.
            const dateElement = $(cards[i]).find(`div.tw-text-grey`).first().text()
            const splicedDate = dateElement.split("il y a ")[1]
            const units = splicedDate.split(" ")
            switch (units[1]) {
                case "jours":
                    createdAt = new Date(Date.now() - 86_400_000 * parseInt(units[0]))
                    break
                case "jour":
                    createdAt = new Date(Date.now() - 86_400_000 * parseInt(units[0]))
                    break
                case "heures":
                    createdAt = new Date(Date.now() - 3_600_000 * parseInt(units[0]))
                    break
                case "heure":
                    createdAt = new Date(Date.now() - 3_600_000 * parseInt(units[0]))
                    break
            }

            // Remove the department code from zone text.
            const splicedZone = zoneName?.replace(/\d+/g, "")
            const zone = splicedZone?.slice(0, splicedZone.length - 3)

            // Check that our data contains at least the crutial data. If not, we don't add it to the result.
            if (title && companyName && zone && createdAt && url) {
                offers.push({
                    id: uuidv4(),
                    title: title,
                    imgUrl: imgUrl,

                    // Welack Description and Url site. Usecase will check this for us if the company name exists in database.
                    company: {
                        id: undefined,
                        name: companyName,
                        logoUrl: logoUrl,
                        description: undefined,
                        url: undefined,
                    },

                    // ID, Lat, Lng doesn't cannot be fetched.
                    zone: {
                        id: undefined,
                        name: zone,
                        lat: undefined,
                        lng: undefined,
                    },

                    // Job type isn't accessible from Hellowork offers pages. It's a work for usecases.
                    job: {
                        id: undefined,
                        title: undefined,
                    },
                    // No tags.
                    tags: [],

                    // Only have access to creation date.
                    createdAt: createdAt,
                    updateAt: undefined,

                    origin: OfferOrigin.HELLOWORK,
                    originUrl: url,
                })
            }
        }

        return offers
    }
}
