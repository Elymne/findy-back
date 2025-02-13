import School from "../models/School.model";

export default interface PrivateSchoolRepository {
    findAll(): School[];
}
