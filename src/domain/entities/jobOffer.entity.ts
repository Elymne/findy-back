export interface JobOffer {
    id?: string
    title: string
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
    origineUrl?: string
    source: offerSource
    createdAt: number
    updatedAt: number
}

export enum offerSource {
    FranceTravail,
    WelcomeToJungle,
}

export interface ExpRequirement {
    code: string
    description: string
}

export interface Contact {
    name: string
    access: string
}

export interface Company {
    name?: string
    description?: string
    logoUrl?: string
    websiteUrl?: string
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

export interface WorkOffice {
    name: string
    lat: number
    long: number
    postalcode: string
    zone: string
}
