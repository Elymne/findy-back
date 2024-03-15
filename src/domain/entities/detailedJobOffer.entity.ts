import { SourceSite } from "../enums/sourceData.enum"

export interface DetailedJobOffer {
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
    workOffice?: WorkOffice
    company?: Company
    contact?: Contact
    expRequirement: ExpRequirement
    softSkills?: SoftSkill[]
    skills?: Skill[]
}

export interface Company {
    name?: string
    description?: string
    logoUrl?: string
    websiteUrl?: string
}

export interface WorkOffice {
    name: string
    lat: number
    long: number
    postalcode: string
    zone: string
}

export interface ExpRequirement {
    code: string
    description: string
}

export interface Contact {
    name: string
    access: string
}

export interface Skill {
    code: string
    description: string
    requirementCode: string
}

export interface SoftSkill {
    title: string
    description: string
}
