import type Offer from "./Offer.model";

export default interface Offers {
    jobs: Offer[];
    currentPage: number;
    maxPage: number;
}
