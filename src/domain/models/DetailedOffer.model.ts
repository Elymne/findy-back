import type Company from "./Company.model";
import type Skill from "./Skill.model";
import type Zone from "./Zone.model";

export default interface DetailedOffer {
    id: string;
    title: string;
    company: Company;
    zone: Zone;
    ref: string;
    description: string;

    skills: Skill[];

    urlOrigin: string;

    createdAt: Date;
    updateAt: Date;

    imgUrl: string;
}
