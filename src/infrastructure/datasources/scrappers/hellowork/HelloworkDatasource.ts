import Offer, { OfferOrigin } from "@App/domain/models/Offer.model";
import JobScrapperRepository from "@App/domain/repositories/JobScrapper.repository";
import axios from "axios";
import { load } from "cheerio";
import { v4 as uuidv4 } from "uuid";

/**
 * This scrapper will scrap job offers from Hellowork website.
 */
export class HelloworkDatasource implements JobScrapperRepository {
    /**
     * Scrap one page of job offers from Hellowork website.
     * If title, company and zone are not found, the offer is not added to the list.
     *
     * @param pageIndex The current page to scrap from Hellowork student job offers.
     * @returns {Job[]} The list of job offers scrapped from Hellowork website.
     */
    async getOnePage(pageIndex: number): Promise<Offer[]> {
        const offers: Offer[] = [];

        const response = await axios.request<string>({
            method: "GET",
            url: `${baseUrl}`,
            params: {
                p: pageIndex,
            },
        });
        const $ = load(response.data);

        const cards = $("div > section > ul.tw-grid > li");
        for (let i = 0; i < cards.length; i++) {
            let title: string | undefined = undefined;
            let company: string | undefined = undefined;
            let zone: string | undefined = undefined;
            let companyLogoUrl: string | undefined = undefined;
            let imgUrl: string | undefined = undefined;
            let createdAt: Date | undefined = undefined;

            // Find text for title and company.
            const textElement = $(cards[i]).find(`div > header > div > a > h3 > p`);
            title = $(textElement[0]).text();
            company = $(textElement[1]).text();

            // Tags.
            const tagsElement = $(cards[i]).find(`div.tw-tag-secondary-s`);
            for (let i = 0; i < tagsElement.length; i++) {
                const tag = $(tagsElement[i]).text().trim();
                if (tag != "Alternance") {
                    zone = tag;
                }
            }

            // Images urls.
            const headerImageElement = $(cards[i]).find(`div > div > header`)[0];
            const imageElements = $(headerImageElement).find("img");
            if (imageElements.length == 1) {
                companyLogoUrl = imageElements.first().attr("src");
            } else {
                companyLogoUrl = $(imageElements[1]).attr("src");
                imgUrl = $(imageElements[0]).attr("src");
            }

            // Parse date.
            // TODO : Ugly as fuck. Maybe change this.
            const dateElement = $(cards[i]).find(`div.tw-text-grey`).first().text();
            const splicedDate = dateElement.split("il y a ")[1];
            const units = splicedDate.split(" ");
            switch (units[1]) {
                case "jours":
                    createdAt = new Date(Date.now() - 86_400_000 * parseInt(units[0]));
                    break;
                case "jour":
                    createdAt = new Date(Date.now() - 86_400_000 * parseInt(units[0]));
                    break;
                case "heures":
                    createdAt = new Date(Date.now() - 3_600_000 * parseInt(units[0]));
                    break;
                case "heure":
                    createdAt = new Date(Date.now() - 3_600_000 * parseInt(units[0]));
                    break;
            }

            if (title && company && zone && createdAt) {
                offers.push({
                    id: uuidv4(),
                    title: title,
                    company: company,
                    zone: zone,
                    jobTitle: undefined, // Information not given by Hellowork.

                    tags: [],

                    companyLogoUrl: companyLogoUrl,
                    imgUrl: imgUrl,

                    createdAt: createdAt,
                    updateAt: undefined,

                    origin: OfferOrigin.HELLOWORK,
                });
            }
        }

        return offers;
    }
}

const baseUrl = "https://www.hellowork.com/fr-fr/emploi/recherche.html?k=&k_autocomplete=&l=&l_autocomplete=&st=relevance&c=Alternance&cod=all&d=all";
