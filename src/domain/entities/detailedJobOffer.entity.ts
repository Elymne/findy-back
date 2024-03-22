import SourceSite from "../enums/sourceData.enum"

export default interface DetailedJobOffer {
    id?: string
    title: string
    imageUrl: string
    sourceUrl: string
    sourceData: SourceSite
    createdAt?: number
    updatedAt?: number
    createdWhile?: string

    jobDomain: string
    description: string
    contractType: string
    contractDescription: string
    salaryDescription: string
    workOffice?: {
        name: string
        lat: number
        long: number
        postalcode: string
        zone: string
    }
    company?: {
        name?: string
        description?: string
        logoUrl?: string
        websiteUrl?: string
    }
    contact?: {
        name: string
        access: string
    }
    expRequirement: {
        code: string
        description: string
    }
    softSkills?: {
        title: string
        description: string
    }[]
    skills?: {
        code: string
        description: string
        requirementCode: string
    }[]
}
