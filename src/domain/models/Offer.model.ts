export default interface Offer {
    id: string;
    title: string;
    description: string;
    company: string;
    companyLogo: string;
    zone: string;
    jobTitle: string;

    tags: string[];

    createdAt: Date;
    updateAt: Date | null;
    imgUrl: string | null;
}
