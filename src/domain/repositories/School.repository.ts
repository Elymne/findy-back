import School from "../models/School.model";

export default interface SchoolRepository {
    findAll(): School[];
}
