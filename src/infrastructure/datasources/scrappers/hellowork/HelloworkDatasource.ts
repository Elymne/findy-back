import Job from "@App/domain/models/Job.model";
import JobScrapperRepository from "@App/domain/repositories/JobScrapper.repository";
import axios, { AxiosRequestConfig } from "axios";
import { load } from "cheerio";

export class HelloworkDatasource implements JobScrapperRepository {
    async getOnePage(pageIndex: number): Promise<Job[]> {
        const options: AxiosRequestConfig = {
            method: "GET",
            url: `${baseUrl}`,
            params: {
                p: pageIndex,
            },
        };

        const response = await axios.request<string>(options);
        const $ = load(response.data);

        const titles = [];
        const companies = [];
        const zones = [];
        const backgroundImages = [];
        const logoImages = [];

        const cards = $("div > section > ul.tw-grid > li");
        for (let i = 0; i < cards.length; i++) {
            const titles = $(cards[i]).find(`div > header > div > a > h3 > p`);
            titles.push(titles[0]);
            companies.push(titles[1]);
        }

        // const tagsElement = $(`div.tw-tag-secondary-s`);
        // for (let i = 0; i < tagsElement.length; i++) {
        //     const tag = $(tagsElement[i]).text().trim();
        //     if (tag != "Alternance") {
        //         zones.push(tag);
        //     }
        // }

        // // ! Can't do that Rework this shit.
        // // const backgroundImagesElement = $(`li > div > div > header > img`);
        // // const logoImagesElement = $(`li > div > div > header > img`);
        // // for (let i = 0; i < backgroundImagesElement.length; i++) {
        // //     backgroundImages.push($(backgroundImagesElement[i]).attr("src"));
        // //     logoImages.push($(logoImagesElement[i]).attr("src"));
        // // }

        // const imageBlocksElement = $("li > div > div > header");

        // for (let i = 0; i < imageBlocksElement.length; i++) {
        //     const test = $(imageBlocksElement[i]).find("div");
        //     console.log(test.length);

        //     if (test.length == 1) {
        //     }
        //     // :/
        //     else {
        //     }
        // }

        // // console.log(titles.length);
        // // console.log(companies.length);
        // // console.log(zones.length);
        // // console.log(backgroundImages.length);
        // // console.log(logoImages.length);

        return [];
    }
}

const baseUrl = "https://www.hellowork.com/fr-fr/emploi/recherche.html?k=&k_autocomplete=&l=&l_autocomplete=&st=relevance&c=Alternance&cod=all&d=all";
