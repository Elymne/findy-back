import { JobOffer } from "@App/domain/entities/jobOffer.entity"
import { JobOfferWTTJ } from "../datasources/wttj/models/JobOfferWTTJ"

export interface JobOfferWTTJParser {
    //parseDetailed: (source: DetailedJobOfferWTTJ[]) => Promise<DetailedJobOffer[]>
    parse: (source: JobOfferWTTJ[]) => Promise<JobOffer[]>
}

export const JobOfferWTTJParserImpl: JobOfferWTTJParser = {
    parse: async function (source: JobOfferWTTJ[]): Promise<JobOffer[]> {
        return source.map((elem) => {
            return {
                title: elem.title,
                companyName: elem.company,
                companyLogoUrl: elem.companyLogo,
                cityName: elem.city,
                imageUrl: elem.image,
                sourceUrl: elem.accessUrl,
                createdWhile: elem.created,
            } as JobOffer
        })
    },
}
