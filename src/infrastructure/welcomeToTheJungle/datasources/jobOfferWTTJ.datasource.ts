import { PupetteerClient } from "@App/infrastructure/tools/clients/pupetteer.client"
import { JobOfferWTTJ } from "../models/JobOfferWTTJ"
import { scrapWTTJPage } from "../scrappers/scrapWTTJFullPage"
import { wttjConst } from "../configs/wttj.const"

export interface JobOfferWTTJDatasource {
    findAllByQuery: (p: { keyWords: string; lat: number; lng: number; page: number; radius: number }) => Promise<JobOfferWTTJ[]>
    findRangeByQuery: (p: { keyWords: string; page: number; nb: number }) => Promise<JobOfferWTTJ[]>
}

export const JobOfferWTTJDatasourceImpl: JobOfferWTTJDatasource = {
    findAllByQuery: async function (p: {
        keyWords: string
        lat: number
        lng: number
        page: number
        radius: number
    }): Promise<JobOfferWTTJ[]> {
        const url: string = "".concat(
            wttjConst.url,
            `?${wttjConst.countryQuery}=FR`,
            `&${wttjConst.contractTypeQuery}=apprenticeship`,
            `&${wttjConst.paramsQuery}=${p.keyWords}`,
            `&${wttjConst.aroundLatLng}=${p.lat},${p.lng}`,
            `&${wttjConst.pageQuery}=${p.page}`,
            `&${wttjConst.aroundRadius}=${p.radius}`
        )

        const page = await PupetteerClient.getInstance().createPage()
        await page.goto(url, { timeout: 10000 })
        await new Promise((f) => setTimeout(f, 3000))
        const result = await scrapWTTJPage(page)
        await page.close()

        return result
    },

    findRangeByQuery: async function (p: { keyWords: string; page: number; nb: number }): Promise<JobOfferWTTJ[]> {
        const url: string = "".concat(
            wttjConst.url,
            `?${wttjConst.countryQuery}=FR`,
            `&${wttjConst.contractTypeQuery}=apprenticeship`,
            `&${wttjConst.paramsQuery}=${p.keyWords}`,
            `&${wttjConst.pageQuery}=${p.page}`
        )

        const page = await PupetteerClient.getInstance().createPage()
        await page.goto(url, { timeout: 10000 })
        await new Promise((f) => setTimeout(f, 3000))
        const result = await scrapWTTJPage(page, { nb: p.nb })
        await page.close()

        return result
    },
}
