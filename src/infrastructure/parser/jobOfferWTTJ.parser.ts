import { JobOffer } from "@App/domain/entities/jobOffer.entity"
import { JobOfferWTTJ } from "../datasources/wttj/models/JobOfferWTTJ"
import { SourceData } from "@App/domain/entities/enums/sourceData.enum"

export interface JobOfferWTTJParser {
    //parseDetailed: (source: DetailedJobOfferWTTJ[]) => Promise<DetailedJobOffer[]>
    parse: (source: JobOfferWTTJ[]) => Promise<JobOffer[]>
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
                source_data: SourceData.WTTJ,
                created_while: elem.created,
            } as JobOffer
        })
    },
}
