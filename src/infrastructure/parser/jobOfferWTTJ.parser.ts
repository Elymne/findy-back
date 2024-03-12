import { JobOffer } from "@App/domain/entities/jobOffer.entity"
import { JobOfferWTTJ } from "../datasources/wttj/models/JobOfferWTTJ"
import { SourceSite } from "@App/domain/entities/enums/sourceData.enum"

export interface JobOfferWTTJParser {
    parse: (source: JobOfferWTTJ[]) => Promise<JobOffer[]>
    //parseDetailed: (source: DetailedJobOfferWTTJ[]) => Promise<DetailedJobOffer[]>
}

export const JobOfferWTTJParserImpl: JobOfferWTTJParser = {
    parse: async function (source: JobOfferWTTJ[]): Promise<JobOffer[]> {
        return source.map((elem) => {
            return {
                title: elem.title,
                company_name: elem.company,
                company_logo_url: elem.companyLogo,
                city_name: elem.city,
                image_url: elem.image,
                source_url: elem.accessUrl,
                source_data: SourceSite.WTTJ,
                created_while: elem.created,
            } as JobOffer
        })
    },
}
