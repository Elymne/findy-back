import School from "@App/domain/models/School.model";
import SchoolRepository from "@App/domain/repositories/School.repository";

export default class SchoolDatasource implements SchoolRepository {
    findAll(): School[] {
        throw new Error("Method not implemented.");
    }
}
